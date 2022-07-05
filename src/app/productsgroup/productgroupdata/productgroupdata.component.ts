import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, ProductGroup } from 'src/app/models';


@Component({
  selector: 'app-productgroupdata',
  templateUrl: './productgroupdata.component.html',
  styleUrls: ['./productgroupdata.component.scss']
})
export class ProductGroupDataComponent implements OnInit {

  form: FormGroup;
  vehicleUser!: ProductGroup;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<ProductGroupDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        groupCode: ['', [Validators.required, Validators.maxLength(30)]],
        groupName: ['', [Validators.required, Validators.maxLength(30)]],

      });


    if (this.data.actionName !== 'add') {
      this.vehicleUser = this.data.data;
      this.form.controls["groupCode"].setValue(this.vehicleUser?.GroupCode);
      this.form.controls["groupName"].setValue(this.vehicleUser?.GroupName);

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
