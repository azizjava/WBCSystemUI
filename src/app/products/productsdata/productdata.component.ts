import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Products, ProductGroup } from 'src/app/models';


@Component({
  selector: 'app-productdata',
  templateUrl: './productdata.component.html',
  styleUrls: ['./productdata.component.scss']
})
export class ProductDataComponent implements OnInit {

  form: FormGroup;
  vehicleUser!: Products;
  transPortersList!: ProductGroup[];

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<ProductDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group(
      {
        productCode: ['', [Validators.required, Validators.maxLength(30)]],
        productName: ['', [Validators.required, Validators.maxLength(30)]],
        groupCode: ['', [Validators.required]],
        groupName: ['', [Validators.required]],

      });

    this._getTransPortersList();

    if (this.data.actionName !== 'add') {
      this.vehicleUser = this.data.data;
      this.form.controls["productCode"].setValue(this.vehicleUser?.ProductCode);
      this.form.controls["productName"].setValue(this.vehicleUser?.ProductName);
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

  public OnSelectionChange(event: any) {
    const name = this.transPortersList.filter(s =>s.GroupCode === event.value)[0]?.GroupName || "";
    this.form.controls["groupName"].setValue(name);
  }

  private _getTransPortersList(): any {
    this.transPortersList = [{ Id :"1", GroupCode: 'PG-01', GroupName: 'Product Group-01' }, {  Id :"2", GroupCode: 'PG-02', GroupName: 'Product Group-02' }, {  Id :"3",GroupCode: 'PG-03', GroupName: 'Product Group-03' } ];
  }

}
