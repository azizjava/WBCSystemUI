import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { TransportersService } from '../transporters.service';


@Component({
  selector: 'app-transportersdata',
  templateUrl: './transportersdata.component.html',
  styleUrls: ['./transportersdata.component.scss'],
})
export class TransportersdataComponent implements OnInit {
  transporterForm: UntypedFormGroup;
  transporterUser!: Transporter;
  public staticText: any = {};

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private httpService: TransportersService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<TransportersdataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.transporterForm = this._formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(30)]],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      contactPerson: [''],
      mobileNo: [''],
      phoneNo: [''],    
      faxNo: [''],
      address: [''],
    });

    if (this.data.actionName !== 'add') {
      this.transporterUser = this.data.data;
      this.transporterForm.controls['code'].setValue(
        this.transporterUser?.transporterCode
      );
      this.transporterForm.controls['name'].setValue(
        this.transporterUser?.transporterName
      );
      this.transporterForm.controls['contactPerson'].setValue(
        this.transporterUser?.contactPerson
      );
      this.transporterForm.controls['mobileNo'].setValue(
        this.transporterUser?.mobileNo
      );
      this.transporterForm.controls['phoneNo'].setValue(
        this.transporterUser?.telephoneNo
      );
      this.transporterForm.controls['faxNo'].setValue(
        this.transporterUser?.faxNo
      );
      this.transporterForm.controls['address'].setValue(
        this.transporterUser?.address
      );

      if (this.data.actionName === 'view') {
        this.transporterForm.disable();
      }

      if (this.data.actionName === 'edit') {
        this.transporterForm.controls['code'].disable();
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
    if (!findInvalidControls(this.transporterForm)) {
      return;
    }

    const result = this.transporterForm.value;

    const newRecord: Transporter = {
      transporterCode: result.code,
      transporterName: result.name,
      contactPerson: result.contactPerson,
      mobileNo: result.mobileNo.toString(),
      telephoneNo: result.phoneNo.toString(),
      faxNo: result.faxNo.toString(),
      address: result.address,
      localCreatedDateTime: new Date(),
      lastModifiedByUser: this.authenticationService.currentUserValue.userName,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewTransporter(newRecord).subscribe({
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
        newRecord.transporterCode = this.transporterUser?.transporterCode;
        this.httpService
          .updateTransporter(newRecord.transporterCode, newRecord)
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
        code: this.translate.instant('transporters.tbl_header.transportercode'),
        name: this.translate.instant(
          'transporters.tbl_header.transportername'
        ),
        contactPerson: this.translate.instant(
          'transporters.tbl_header.contactperson'
        ),
        mobileNo: this.translate.instant('transporters.tbl_header.mobileno'),
        phoneNo: this.translate.instant('transporters.tbl_header.telephoneno'),
        faxNo: this.translate.instant('transporters.tbl_header.faxno'),
        address: this.translate.instant('transporters.tbl_header.address'),
        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
      };
    });
  }

  private _onFormValueChange() {
    const initialValue = this.transporterForm.value;
    this.transporterForm.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.transporterForm.value[key] != initialValue[key]
      );
    });
  }
}
