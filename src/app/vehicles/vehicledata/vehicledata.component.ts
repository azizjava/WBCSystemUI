import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import {
  modelDialog,
  Vehicle,
  TransporterList,
  Transporter,
} from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { VehiclesService } from '../vehicles.service';

@Component({
  selector: 'app-vehicledata',
  templateUrl: './vehicledata.component.html',
  styleUrls: ['./vehicledata.component.scss'],
})
export class VehicleDataComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleData!: any;
  public staticText: any = {};
  transPortersList!: TransporterList[];

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<VehicleDataComponent>,
    private httpService: VehiclesService,
    private transportersService: TransportersService,
    private alertService: AlertService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.vehicleForm = this._formBuilder.group({
      plateNo: ['', [Validators.required, Validators.maxLength(30)]],
      type: ['', [Validators.required, Validators.maxLength(30)]],
      transporterCode: ['', [Validators.required]],
      transporterName: ['', [Validators.required]],
    });

    if (this.data.actionName !== 'add') {
      this.vehicleData = this.data?.data;
      this.vehicleForm.controls['plateNo'].setValue(this.vehicleData?.plateNo);
      this.vehicleForm.controls['type'].setValue(this.vehicleData?.vehicleType);
      this.vehicleForm.controls['transporterCode'].setValue(
        this.vehicleData.transporters?.transporterCode
      );
      this.vehicleForm.controls['transporterName'].setValue(
        this.vehicleData.transporters?.nameOfTransporter
      );

      if (this.data.actionName === 'view') {
        this.vehicleForm.disable();
      }

      if (this.data.actionName === 'edit') {
        this.vehicleForm.controls['plateNo'].disable();
      }
    }

    this._getTransPortersList();
    this._getTranslatedText();
    this._onFormValueChange();
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.vehicleForm)) {
      return;
    }

    const result = this.vehicleForm.value;

    const newRecord: any = {
      plateNo: result.plateNo,
      vehicleType: result.type,
      transporterCode: result.transporterCode,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewVehicle(newRecord).subscribe({
        next: (res: any) => {
          this.dialogRef.close(res);
        },
        error: (error: string) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else if (this.data.actionName === 'edit') {
      if (this._hasChange) {
        newRecord.plateNo = this.vehicleData?.plateNo;
        this.httpService.updateVehicle(newRecord.plateNo, newRecord).subscribe({
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

  public OnSelectionChange(event: any) {
    const name =
      this.transPortersList.filter((s) => s.transporterCode === event.value)[0]
        ?.nameOfTransporter || '';
    this.vehicleForm.controls['transporterName'].setValue(name);
  }

  private _getTransPortersList(): any {
    this.transportersService.getAllTransporters().subscribe({
      next: (data: Transporter[]) => {
        this.transPortersList = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        plateno: this.translate.instant('vehicles.tbl_header.plateno'),
        vehicletype: this.translate.instant('vehicles.tbl_header.vehicletype'),
        transportercode: this.translate.instant('vehicles.tbl_header.transportercode'),
        transportername: this.translate.instant('vehicles.tbl_header.transportername'),       
        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
        ddlcode:this.translate.instant('vehicles.tbl_header.ddlcode'), 
      };
    });
  }

  private _onFormValueChange() {
    const initialValue = this.vehicleForm.value;
    this.vehicleForm.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.vehicleForm.value[key] != initialValue[key]
      );
    });
  }
}
