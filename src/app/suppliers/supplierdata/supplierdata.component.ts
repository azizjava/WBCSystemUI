import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';


@Component({
  selector: 'app-supplierdata',
  templateUrl: './supplierdata.component.html',
  styleUrls: ['./supplierdata.component.scss']
})
export class SupplierdataComponent implements OnInit {

  form: FormGroup;
  formData!: any;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<SupplierdataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        code: ['', [Validators.required, Validators.maxLength(30)]],
        name: ['', [Validators.required, Validators.maxLength(30)]],
        contactPerson: ['', [Validators.required]],
        mobileNo: ['', [Validators.required]],
        phoneNo: ['', [Validators.required]],
        // mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        // phoneNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        faxNo: ['', [Validators.required]],
        address: ['', [Validators.required]],
      });

    if (this.data.actionName !== 'add') {
      this.formData = this.data.data;
      this.form.controls["code"].setValue(this.formData?.Code);
      this.form.controls["name"].setValue(this.formData?.Name);
      this.form.controls["contactPerson"].setValue(this.formData?.ContactPerson);
      this.form.controls["mobileNo"].setValue(this.formData?.MobileNo);
      this.form.controls["phoneNo"].setValue(this.formData?.PhoneNo);
      this.form.controls["faxNo"].setValue(this.formData?.FaxNo);
      this.form.controls["address"].setValue(this.formData?.Address);

      if (this.data.actionName === 'view') {
         this.form.disable();
        }

    }

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }

}
