import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { Customer, modelDialog, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { CustomersService } from '../Customers.service';

@Component({
  selector: 'app-customerdata',
  templateUrl: './customerdata.component.html',
  styleUrls: ['./customerdata.component.scss'],
})
export class CustomerdataComponent implements OnInit {
  form: UntypedFormGroup;
  customerData!: Customer;
  public staticText: any = {};

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CustomerdataComponent>,
    private translate: TranslateService,
    private httpService: CustomersService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      customerCode: ['', [Validators.required, Validators.maxLength(30)]],
      customerName: ['', [Validators.required, Validators.maxLength(30)]],
      contactPerson: [''],
      mobileNo: [''],
      telephoneNo: [''],
      faxNo: [''],
      address: [''],
    });

    if (this.data.actionName !== 'add') {
      this.customerData = this.data.data;
      this.form.controls['customerCode'].setValue(
        this.customerData?.customerCode
      );
      this.form.controls['customerName'].setValue(
        this.customerData?.customerName
      );
      this.form.controls['contactPerson'].setValue(
        this.customerData?.contactPerson
      );
      this.form.controls['mobileNo'].setValue(this.customerData?.mobileNo);
      this.form.controls['telephoneNo'].setValue(
        this.customerData?.telephoneNo
      );
      this.form.controls['faxNo'].setValue(this.customerData?.faxNo);
      this.form.controls['address'].setValue(this.customerData?.address);

      if (this.data.actionName === 'view') {
        this.form.disable();
      }

      if (this.data.actionName === 'edit') {
        this.form.controls['customerCode'].disable();
      }
    }

    this._getTranslatedText();
    this._onFormValueChange();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }

    const result = this.form.value;

    const newRecord: Customer = {
      customerCode: result.customerCode,
      customerName: result.customerName,
      contactPerson: result.contactPerson,
      mobileNo: result.mobileNo.toString(),
      telephoneNo: result.telephoneNo.toString(),
      faxNo: result.faxNo.toString(),
      address: result.address,
      localCreatedDateTime: new Date(),
      lastModifiedByUser: this.authenticationService.currentUserValue.userName,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewCustomer(newRecord).subscribe({
        next: (res: any) => {
          this.dialogRef.close(res);
        },
        error: (error: string) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else if (this.data.actionName === 'edit') {
      if (this._hasChange) {
        newRecord.customerCode = this.customerData?.customerCode;
        this.httpService
          .updateCustomer(newRecord.customerCode, newRecord)
          .subscribe({
            next: (res) => {
              this.dialogRef.close(res);
            },
            error: (error) => {
              console.log(error);
              this.alertService.error(error);
            },
          });
      } else {
        this.dialogRef.close();
      }
    }
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        customerCode: this.translate.instant(
          'customers.tbl_header.customercode'
        ),
        customerName: this.translate.instant(
          'customers.tbl_header.customername'
        ),
        contactPerson: this.translate.instant(
          'customers.tbl_header.contactperson'
        ),
        mobileNo: this.translate.instant('customers.tbl_header.mobileno'),
        telephoneNo: this.translate.instant('customers.tbl_header.telephoneno'),
        faxNo: this.translate.instant('customers.tbl_header.faxno'),
        address: this.translate.instant('customers.tbl_header.address'),
        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
      };
    });
  }

  private _onFormValueChange() {
    const initialValue = this.form.value;
    this.form.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.form.value[key] != initialValue[key]
      );
    });
  }
}
