import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
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

  
  exitForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  productsList: any = [];
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
      deductWeight: ['', [Validators.required, Validators.maxLength(50)]],
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
      instructions: ['', [Validators.required, Validators.maxLength(250)]],
      deliveryNoteNo: ['', [Validators.required, Validators.maxLength(50)]],
      orderNo: ['', [Validators.required, Validators.maxLength(50)]],
    });
      
    this.getTransactionById();
    this.keyValueData.length ===0 && this.keyValueData.push({ name: '', value: '' });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['weight'] && !changes['weight']?.firstChange) {
      this.exitForm.controls['secondWeight'].setValue(changes['weight'].currentValue);
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

  console.log(newRecord);

  this.httpService.updateTransaction(newRecord).subscribe({
    next: (res) => {
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
      
    }
    
  }
}
