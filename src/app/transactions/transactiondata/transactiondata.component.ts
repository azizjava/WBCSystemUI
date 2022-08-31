import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';


@Component({
  selector: 'app-transactiondata',
  templateUrl: './transactiondata.component.html',
  styleUrls: ['./transactiondata.component.scss']
})
export class TransactiondataComponent implements OnInit {

  transporterForm: FormGroup;
  transporterUser!: Transporter;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<TransactiondataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.transporterForm = this._formBuilder.group(
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
      this.transporterForm.controls["code"].setValue(this.transporterUser?.Code);
      this.transporterForm.controls["name"].setValue(this.transporterUser?.Name);
      this.transporterForm.controls["contactPerson"].setValue(this.transporterUser?.ContactPerson);
      this.transporterForm.controls["mobileNo"].setValue(this.transporterUser?.MobileNo);
      this.transporterForm.controls["phoneNo"].setValue(this.transporterUser?.PhoneNo);
      this.transporterForm.controls["faxNo"].setValue(this.transporterUser?.FaxNo);
      this.transporterForm.controls["address"].setValue(this.transporterUser?.Address);

      if (this.data.actionName === 'view') {
         this.transporterForm.disable();
        }

    }

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.transporterForm)) {
      return;
    }
    this.dialogRef.close(this.transporterForm.value);
  }

}
