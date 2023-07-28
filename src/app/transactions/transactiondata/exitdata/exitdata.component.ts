import { Component, ElementRef, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { modelDialog, Product, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { ProductsService } from 'src/app/supplierproducts/products.service';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transactionexitdata',
  templateUrl: './exitdata.component.html',
  styleUrls: ['./exitdata.component.scss'],
})
export class exitDataComponent implements OnInit, OnChanges {

  @Input() weight : number = 0; 
  @Input() sequenceno : string = '';
  @Input() transactionData: any;
  @Input() selectedScaleType: string = '';
  @Input() actionName: string = '';

  
  exitForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];
  keyValueData: any = [];
  emptyKeyValue: boolean = false;

  @ViewChild('video1') videoElement1: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') videoElement2: ElementRef<HTMLVideoElement>;
  @ViewChild('video3') videoElement3: ElementRef<HTMLVideoElement>;
  @ViewChild('video4') videoElement4: ElementRef<HTMLVideoElement>;

  @ViewChild('snap1') snap1: ElementRef<HTMLImageElement>;
  @ViewChild('snap2') snap2: ElementRef<HTMLImageElement>;
  @ViewChild('snap3') snap3: ElementRef<HTMLImageElement>;
  @ViewChild('snap4') snap4: ElementRef<HTMLImageElement>;

  @Output() hideSnap1: boolean = true;
  @Output() hideSnap2: boolean = true;
  @Output() hideSnap3: boolean = true;
  @Output() hideSnap4: boolean = true;

  video1: HTMLVideoElement;
  video2: HTMLVideoElement;
  video3: HTMLVideoElement;
  video4: HTMLVideoElement;
  canvas: HTMLCanvasElement;

  constructor(
    private httpService: TransactionsService,
    private _formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductsService,
    private zone: NgZone,
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

    if (this.actionName === 'view') {
      this.exitForm.disable();
    }

    this.zone.runOutsideAngular(() => {
      if (this.actionName === undefined) {
        setInterval(() => {
          this.exitForm.controls['timeOut'].setValue(
            GlobalConstants.commonFunction.getFormattedTime()
          );
        }, 1000);
      }
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

 capture(cameraNumber:number)
 {
   let tmpCanvas = document.createElement('canvas');
   tmpCanvas.width = 1024;
   tmpCanvas.height = 768;
   let ctx: CanvasRenderingContext2D | null;
   if(!( ctx = tmpCanvas.getContext("2d")))
   {
     throw new Error(`2d context not supported or canvas already initialized`);
   }
   
   switch (cameraNumber) {      
     case 1: 
       ctx.drawImage(this.videoElement1.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);
       this.snap1.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap1 = false;
       break;
     case 2:         
       ctx.drawImage(this.videoElement2.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap2.nativeElement.src = tmpCanvas.toDataURL();   
       this.hideSnap2 = false;
       break;
     case 3:
       ctx.drawImage(this.videoElement3.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap3.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap3 = false;
       break;
     case 4:
       ctx.drawImage(this.videoElement4.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap4.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap4 = false;
       break;
     default:
       break;      
   }  
 }

 clearsnap(cameraNumber:number)
 {
   switch (cameraNumber) {      
     case 1:          
       this.snap1.nativeElement.src = "";
       this.hideSnap1 = true;
       break;
     case 2:   
       this.snap2.nativeElement.src = "";   
       this.hideSnap2 = true;
       break;
     case 3:
       this.snap3.nativeElement.src = "";
       this.hideSnap3 = true;
       break;
     case 4: 
       this.snap4.nativeElement.src = "";
       this.hideSnap4 = true;        
       break;
     default:
       break;      
   }  
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
    transactionStatus: 'TX COMPLETED',
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
      this.productService.getAllProducts().subscribe({
        next: (data: Product[]) => {          
          this._priceTons(data);   
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });   
        
  }

  private _priceTons(productsList :Product[]) {
    const productData = productsList.find(
      (p:Product) =>
        p.productCode === this.transactionData.dailyTransactionEntry.productCode
    );
    if (productData) {
      const price =
        this.transactionData.dailyTransactionEntry.goodsType === 'incoming'
          ? productData.supplierPrice
          : productData.customerPrice;
      this.exitForm.controls['priceTons'].setValue(price);
    }
    
  }
}
