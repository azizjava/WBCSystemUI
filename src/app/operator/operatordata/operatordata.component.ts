import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Operator, } from 'src/app/models';


@Component({
  selector: 'app-operatordata',
  templateUrl: './operatorData.component.html',
  styleUrls: ['./operatorData.component.scss']
})
export class OperatorDataComponent implements OnInit {

  form: UntypedFormGroup;
  vehicleUser!: Operator;

  constructor(private _formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<OperatorDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        operatorId: ['', [Validators.required, Validators.maxLength(30)]],
        operatorName: ['', [Validators.required, Validators.maxLength(30)]],

      });


    if (this.data.actionName !== 'add') {
      this.vehicleUser = this.data.data;
      this.form.controls["operatorId"].setValue(this.vehicleUser?.OperatorId);
      this.form.controls["operatorName"].setValue(this.vehicleUser?.OperatorName);

      if (this.data.actionName === 'view') {
        this.form.disable();
      }

    }

  }


  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }


}
