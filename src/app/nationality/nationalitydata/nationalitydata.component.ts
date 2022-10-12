import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Nationality } from 'src/app/models';


@Component({
  selector: 'app-nationalitydata',
  templateUrl: './nationalitydata.component.html',
  styleUrls: ['./nationalitydata.component.scss']
})
export class NationalityDataComponent implements OnInit {

  form: UntypedFormGroup;
  recordData!: Nationality;

  constructor(private _formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<NationalityDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        nationality: ['', [Validators.required, Validators.maxLength(30)]],

      });


    if (this.data.actionName !== 'add') {
      this.recordData = this.data.data;
      this.form.controls["nationality"].setValue(this.recordData?.Nationality);

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
