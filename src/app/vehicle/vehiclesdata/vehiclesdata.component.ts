import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Vehicle, TransporterList } from 'src/app/models';


@Component({
  selector: 'app-vehiclesdata',
  templateUrl: './vehiclesdata.component.html',
  styleUrls: ['./vehiclesdata.component.scss']
})
export class VehiclesDataComponent implements OnInit {

  vehicleForm: FormGroup;
  vehicleUser!: Vehicle;
  transPortersList!: TransporterList[];

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<VehiclesDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog) { }

  ngOnInit(): void {

    this.vehicleForm = this._formBuilder.group(
      {
        plateNo: ['', [Validators.required, Validators.maxLength(30)]],
        type: ['', [Validators.required, Validators.maxLength(30)]],
        transporterCode: ['', [Validators.required]],
        transporterName: ['', [Validators.required]],

      });

    this._getTransPortersList();

    if (this.data.actionName !== 'add') {
      this.vehicleUser = this.data.data;
      this.vehicleForm.controls["plateNo"].setValue(this.vehicleUser?.PlateNo);
      this.vehicleForm.controls["type"].setValue(this.vehicleUser?.Type);
      this.vehicleForm.controls["transporterCode"].setValue(this.vehicleUser?.TransporterCode);
      this.vehicleForm.controls["transporterName"].setValue(this.vehicleUser?.TransporterName);

      if (this.data.actionName === 'view') {
        this.vehicleForm.disable();
      }

    }

  }

  


  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.vehicleForm)) {
      return;
    }
    this.dialogRef.close(this.vehicleForm.value);
  }

  public OnSelectionChange(event: any) {
    const name = this.transPortersList.filter(s =>s.Code === event.value)[0]?.Name || "";
    this.vehicleForm.controls["transporterName"].setValue(name);
  }

  private _getTransPortersList(): any {
    this.transPortersList = [{ Code: 'T-01', Name: 'Transporter-01' }, { Code: 'T-02', Name: 'Transporter-02' }, { Code: 'T-03', Name: 'Transporter-03' } ];
  }

}
