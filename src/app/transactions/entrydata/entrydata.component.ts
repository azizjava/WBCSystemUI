import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';


@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entryData.component.html',
  styleUrls: ['./entryData.component.scss']
})
export class entryDataComponent implements OnInit {

  entryForm: FormGroup;
  transporterUser!: Transporter;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<entryDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.entryForm = this._formBuilder.group(
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
      this.transporterUser = this.data.data;
      this.entryForm.controls["code"].setValue(this.transporterUser?.Code);
      this.entryForm.controls["name"].setValue(this.transporterUser?.Name);
      this.entryForm.controls["contactPerson"].setValue(this.transporterUser?.ContactPerson);
      this.entryForm.controls["mobileNo"].setValue(this.transporterUser?.MobileNo);
      this.entryForm.controls["phoneNo"].setValue(this.transporterUser?.PhoneNo);
      this.entryForm.controls["faxNo"].setValue(this.transporterUser?.FaxNo);
      this.entryForm.controls["address"].setValue(this.transporterUser?.Address);

      if (this.data.actionName === 'view') {
         this.entryForm.disable();
        }

    }

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }
    this.dialogRef.close(this.entryForm.value);
  }

}
