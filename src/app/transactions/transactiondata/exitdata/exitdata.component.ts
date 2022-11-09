import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-transactionexitdata',
  templateUrl: './exitData.component.html',
  styleUrls: ['./exitData.component.scss'],
})
export class exitDataComponent implements OnInit, OnChanges {

  @Input() weight : number =0; 

  public staticText: any = {};
  
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
    private _formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.exitForm = this._formBuilder.group({
      sequenceNo: [0, [Validators.required, Validators.maxLength(50)]],
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
      totalPrice: ['', [Validators.required, Validators.maxLength(50)]],
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
    this.keyValueData.push({ key: '', value: '' });   
    this.getTranslatedText();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['weight']?.firstChange) {
      this.exitForm.controls['secondWeight'].setValue(changes['weight'].currentValue);
    }
  }

  public printLayout(): void {
    window.print();
 }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.exitForm)) {
      return;
    }
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
      this.keyValueData.push({ key: '', value: '' });
    } else {
      this.emptyKeyValue = this.keyValueData.some((obj: any) => !obj.key);
      if (!this.emptyKeyValue) {
        this.keyValueData.push({ key: '', value: '' });
      }
    }
  }

  public trackByFn(index: number, item: any) {
    return item;
  }
 
  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
        print: this.translate.instant('actions.print'),
        add: this.translate.instant('actions.add'),
        required: this.translate.instant('common.required'),
        operator: this.translate.instant('transactions.data.exit.operator'),
        role: this.translate.instant('transactions.data.exit.role'),
        dateout: this.translate.instant('transactions.data.exit.dateout'),
        timeout: this.translate.instant('transactions.data.exit.timeout'),
        deductweight: this.translate.instant('transactions.data.exit.deductweight'),
        secondweight: this.translate.instant('transactions.data.exit.secondweight'),
        netweight: this.translate.instant('transactions.data.exit.netweight'),
        price: this.translate.instant('transactions.data.exit.price'),
        totalprice: this.translate.instant('transactions.data.exit.totalprice'),
        orderno: this.translate.instant('transactions.data.exit.orderno'),
        key: this.translate.instant('transactions.data.exit.key'),
        value: this.translate.instant('transactions.data.exit.value'),
        addkeyvalues: this.translate.instant('transactions.data.exit.addkeyvalues'),
        emptykeyvalue: this.translate.instant('transactions.data.exit.emptykeyvalue'),
        instructions: this.translate.instant('transactions.data.exit.instructions'),    
        loginusername: this.translate.instant('transactions.data.exit.loginusername'),
        sequenceno: this.translate.instant('transactions.data.entry.sequenceno'),

      };
    });
  }
}
