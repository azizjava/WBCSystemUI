import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Supplier } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { SuppliersService } from '../suppliers.service';


@Component({
  selector: 'app-supplierdata',
  templateUrl: './supplierdata.component.html',
  styleUrls: ['./supplierdata.component.scss']
})
export class SupplierdataComponent implements OnInit {

  form: UntypedFormGroup;
  supplierData!: Supplier;
  public staticText: any = {};

  private _hasChange: boolean = false;

  constructor(private _formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<SupplierdataComponent>,
    private translate: TranslateService,
    private httpService: SuppliersService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        supplierCode: ['', [Validators.required, Validators.maxLength(30)]],
        supplierName: ['', [Validators.required, Validators.maxLength(30)]],
        contactPerson: ['', [Validators.required]],
        mobileNo: ['', [Validators.required]],
        telephoneNo: ['', [Validators.required]],     
        faxNo: ['', [Validators.required]],
        address: ['', [Validators.required]],
      });

    if (this.data.actionName !== 'add') {
      this.supplierData = this.data.data;
      this.form.controls["supplierCode"].setValue(this.supplierData?.supplierCode);
      this.form.controls["supplierName"].setValue(this.supplierData?.supplierName);
      this.form.controls["contactPerson"].setValue(this.supplierData?.contactPerson);
      this.form.controls["mobileNo"].setValue(this.supplierData?.mobileNo);
      this.form.controls["telephoneNo"].setValue(this.supplierData?.telephoneNo);
      this.form.controls["faxNo"].setValue(this.supplierData?.faxNo);
      this.form.controls["address"].setValue(this.supplierData?.address);

      if (this.data.actionName === 'view') {
         this.form.disable();
      }

      if (this.data.actionName === 'edit') {
        this.form.controls['supplierCode'].disable();
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

    const newRecord: Supplier = {
      supplierCode: result.supplierCode,
      supplierName: result.supplierName,
      contactPerson: result.contactPerson,
      mobileNo: result.mobileNo.toString(),
      telephoneNo: result.telephoneNo.toString(),
      faxNo: result.faxNo.toString(),
      address: result.address,
      localCreatedDateTime: new Date(),
      lastModifiedByUser: this.authenticationService.currentUserValue.userName,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewSupplier(newRecord).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else if (this.data.actionName === 'edit') {
      if (this._hasChange) {
        newRecord.supplierCode = this.supplierData?.supplierCode;
        this.httpService
          .updateSupplier(newRecord.supplierCode, newRecord)
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
        supplierCode: this.translate.instant('suppliers.tbl_header.suppliercode'),
        supplierName: this.translate.instant('suppliers.tbl_header.suppliername'),
        contactPerson: this.translate.instant('suppliers.tbl_header.contactperson'),
        mobileNo: this.translate.instant('suppliers.tbl_header.mobileno'),
        telephoneNo: this.translate.instant('suppliers.tbl_header.telephoneno'),
        faxNo: this.translate.instant('suppliers.tbl_header.faxno'),
        address: this.translate.instant('suppliers.tbl_header.address'),
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
