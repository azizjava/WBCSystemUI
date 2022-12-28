import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common';
import { CustomerProductsService } from 'src/app/customerproducts/customerproducts.service';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { modelDialog, Product, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { SupplierProductsService } from 'src/app/supplierproducts/products.service';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transactionexitdata',
  templateUrl: './exitData.component.html',
  styleUrls: ['./exitData.component.scss'],
})
export class exitDataComponent implements OnInit, OnChanges {

  @Input() weight : number = 0; 
  @Input() sequenceno : string = '';
  @Input() transactionData: any;
  @Input() selectedScaleType: string = '';

  
  exitForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];
  keyValueData: any = [];
  emptyKeyValue: boolean = false;

  constructor(
    private httpService: TransactionsService,
    private _formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private custProductService: CustomerProductsService,
    private suppProductService: SupplierProductsService,
  ) {}

  ngOnInit(): void {
    this.exitForm = this._formBuilder.group({
      sequenceNo: [{
        value:this.sequenceno ?? 0,
        disabled: true,
      } ],
      secondWeight: ['', [Validators.required, Validators.maxLength(50)]],
      dateOut: [
        {
          value: GlobalConstants.commonFunction.getFormattedDate(),
          disabled: true,
        },
      ],
      timeOut: [
        {
          value: GlobalConstants.commonFunction.getFormattedTime(),
          disabled: true,
        },
      ],
      deductWeight: [0, [Validators.required, Validators.maxLength(50)]],
      netWeight: ['', [Validators.required, Validators.maxLength(50)]],
      priceTons: ['', [Validators.required, Validators.maxLength(50)]],
      totalPrice: ['', [Validators.required, Validators.maxLength(50), patternNumberValidator()]],
      role: [{value :this.authenticationService.currentUserValue.role , disabled: true}],
      loginUserName: [
        {
          value: this.authenticationService.currentUserValue.userName,
          disabled: true,
        },
      ],
      instructions: ['', [Validators.maxLength(250)]],
      deliveryNoteNo: ['', [ Validators.maxLength(50)]],
      orderNo: ['', [Validators.maxLength(50)]],
    });
      
    this.getTransactionById();
    this.keyValueData.length ===0 && this.keyValueData.push({ name: '', value: '' });

    this.exitForm.get('deductWeight')?.valueChanges.subscribe(v => {
      this._calculateNetWeight(v);
    });

    this.exitForm.get('secondWeight')?.valueChanges.subscribe(v => {
      this._calculateNetWeight();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['weight'] && !changes['weight']?.firstChange) {
      this.exitForm.controls['secondWeight'].setValue(changes['weight'].currentValue);
      this._calculateNetWeight();
    }

    if (changes['transactionData'] && !changes['transactionData']?.firstChange) {
      this.getTransactionById();
    }
  }

  public printLayout(): void {
    window.print();
 }

 save() {
  // stop here if form is invalid
  if (!findInvalidControls(this.exitForm)) {
    return;
  }

  const result = this.exitForm.value;

  const newRecord = {
    dailyTransactionExit: {
      deductWeight: result.deductWeight,
      deliveryNoteNo: result.deliveryNoteNo,
      driverName: result.driverName,
      exitDate: GlobalConstants.commonFunction.getFormattedDate(),
      exitTime:GlobalConstants.commonFunction.getFormattedTime().toUpperCase(),
      exitDeliveryInstructions: result.instructions,
      exitKeyPairs: this.keyValueData,
      exitLoginRoleName: this.authenticationService.currentUserValue.role,
      exitLoginUserName: this.authenticationService.currentUserValue.userName,
      secondWeight: result.secondWeight,
      netWeight: result.netWeight,
      orderNo: result.orderNo,
      pricePerTon: result.priceTons,
      totalPrice: result.totalPrice,     
    },
    dailyTransactionEntry:this.transactionData.dailyTransactionEntry,
    sequenceNo: this.sequenceno,
    transactionStatus: 'Exit Completed',
  };


  this.httpService.updateTransaction(newRecord).subscribe({
    next: (result) => {
      this.alertService.success(
        `${result.sequenceNo} updated successfully`
      );
    },
    error: (error) => {
      this.alertService.error(error);
    },
  });
}

  public cancel(): void {
    this.router.navigate(['/dashboard/transactions'], {
      relativeTo: this.route,
    });
  }

  public addKeyValues(event :Event) {
    event.stopPropagation();
    if (this.keyValueData.length === 0) {
      this.emptyKeyValue = false;
      this.keyValueData.push({ name: '', value: '' });
    } else {
      this.emptyKeyValue = this.keyValueData.some((obj: any) => !obj.name);
      if (!this.emptyKeyValue) {
        this.keyValueData.push({ name: '', value: '' });
      }
    }
  }

  public trackByFn(index: number, item: any) {
    return item;
  }
 
 private _calculateNetWeight(deductWgt :number =0): void {

  const result = this.exitForm.value;

  const goodsType = this.transactionData.dailyTransactionEntry.goodsType;
  const firstWeight = +this.transactionData.dailyTransactionEntry.firstWeight;
  const secondWeight = +result.secondWeight || 0;
  const deductWeight = +deductWgt || +result.deductWeight;
  let netWeight = 0; 
  const productPrice = this.exitForm.controls['priceTons'].value;
  

  if(goodsType  === 'incoming'){
    netWeight = (firstWeight -secondWeight) -deductWeight;
  }
  else{
    netWeight = (secondWeight -firstWeight) -deductWeight;
  }

  let totalPrice: number = netWeight * productPrice;
  if(this.selectedScaleType ==='KG'){
    totalPrice =  totalPrice /1000;
  }
  if(this.selectedScaleType ==='LB'){
    totalPrice =  totalPrice /2205;
  }

  totalPrice = parseFloat(totalPrice.toFixed(3));
  this.exitForm.controls['netWeight'].setValue(netWeight);
  this.exitForm.controls['totalPrice'].setValue(totalPrice >0 ? totalPrice : 0);

 }

  private getTransactionById(): void {
    if (this.transactionData &&  this.transactionData.dailyTransactionExit) {

      const data = this.transactionData.dailyTransactionExit;

      if(data.exitLoginUserName){
        this.exitForm.controls['deductWeight'].setValue(data.deductWeight);
        this.exitForm.controls['deliveryNoteNo'].setValue(data.deliveryNoteNo);
        this.exitForm.controls['dateOut'].setValue(data.exitDate);
        this.exitForm.controls['instructions'].setValue(data.exitDeliveryInstructions);
        this.exitForm.controls['role'].setValue(data.exitLoginRoleName);
        this.keyValueData = data.exitKeyPairs;
        
        this.exitForm.controls['loginUserName'].setValue(data.exitLoginUserName);
        this.exitForm.controls['timeOut'].setValue(data.exitTime);
        this.exitForm.controls['netWeight'].setValue(data.netWeight);
        this.exitForm.controls['orderNo'].setValue(data.orderNo);
        this.exitForm.controls['priceTons'].setValue(data.pricePerTon);
        this.exitForm.controls['secondWeight'].setValue(data.secondWeight);
        this.exitForm.controls['totalPrice'].setValue(data.totalPrice);
      }
      
      this._getAllProducts();
      
    }
    
  }

  private _getAllProducts() {
    if (this.transactionData.dailyTransactionEntry.goodsType === 'incoming') {

      this.suppProductService.getAllProducts().subscribe({
        next: (data: Product[]) => {          
          this._priceTons(data);   
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
  
    }
    else{
      this.custProductService.getAllProducts().subscribe({
        next: (data: Product[]) => {          
          this._priceTons(data);         
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      }); 
    }      
  }

  private _priceTons(productsList :Product[]) {
    const productPrice = productsList.find((p:Product) => p.productCode === this.transactionData.dailyTransactionEntry.productCode)?.productPrice || 0;
    this.exitForm.controls['priceTons'].setValue(productPrice);
  }
}
