import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, WeighBridge } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { WeightBridgeService } from '../weightbridge.service';

@Component({
  selector: 'app-weighbridgesetting',
  templateUrl: './addweighbridgesetting.component.html',
  styleUrls: ['./addweighbridgesetting.component.scss'],
})
export class AddWeighbridgesettingComponent implements OnInit {
  weightForm: UntypedFormGroup;
  deviceData!: WeighBridge;

  weighBridgeTypeList: any = [];

  portList: any = [];
  filteredPortList: Observable<any[]>;
  baudRateList: any = [];
  filteredBaudRateList: Observable<any[]>;
  dataBitsList: any = [];
  filteredDataBitsRateList: Observable<any[]>;
  parityList: any = [];
  filteredParityList: Observable<any[]>;
  stopBitsList: any = [];
  filteredStopBitsList: Observable<any[]>;

  private _hasChange: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddWeighbridgesettingComponent>,
    private httpService: WeightBridgeService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
    ) {}

  public ngOnInit(): void {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.weightForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      deviceStatus: [false, [ Validators.maxLength(50)]],
      weightBridgeType:['', [ Validators.maxLength(50)]],
      endPoint: ['', [Validators.maxLength(250)], ],      
      portNo: ['', [ Validators.maxLength(50)]],
      baudRate: ['', [ Validators.maxLength(50)]],
      dataBits: ['', [ Validators.maxLength(50)]],
      parity: ['', [ Validators.maxLength(50)]],
      stopBits: ['', [ Validators.maxLength(50)]],
    });

    this._setListData();
    this._setAutoCompleteControlData();
    this._onFormValueChange();


    if (this.data.actionName !== 'add') {
      this.deviceData = this.data?.data?.deviceData;

      this.weightForm.controls['name'].setValue(this.deviceData?.name);
      this.weightForm.controls['deviceStatus'].setValue(this.deviceData?.deviceStatus === "ENABLED" ? true:false);
      this.weightForm.controls['weightBridgeType'].setValue(this.deviceData?.weightBridgeType);
      this.weightForm.controls['endPoint'].setValue(this.deviceData?.endPoint);      
      this.weightForm.controls['portNo'].setValue(this.deviceData?.portNo.toString());
      this.weightForm.controls['baudRate'].setValue(this.deviceData?.baudRate.toString());
      this.weightForm.controls['dataBits'].setValue(this.deviceData?.dataBits.toString());
      this.weightForm.controls['parity'].setValue(this.deviceData?.parity);
      this.weightForm.controls['stopBits'].setValue(this.deviceData?.stopBits.toString());

      if (this.data.actionName === 'view') {
        this.weightForm.disable();
      }

      if (this.data.actionName === 'edit') {
        this.weightForm.controls['name'].disable();
      }
    }
  }

  updateAllComplete() {}

  public trackByFn(index: number, item: any) {
    return item;
  }

  public onDeviceStatusChange(event:MatCheckboxChange): void {
    if(event.checked){
      const isNameExist = this._checkForDuplicateWeighBridges(this.weightForm.value.weightBridgeType);

      if(!isNameExist){
        this.weightForm.controls['deviceStatus'].setValue(false);
        return;
      }
    }    
}

  public close() {
    this.dialogRef.close();
  }

  public reset() {
    this.weightForm.markAsPristine();
    this.weightForm.markAsUntouched();
    this.weightForm.reset();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.weightForm)) {
      return;
    }

    const result = this.weightForm.value;

    const newRecord: any = {
      name: result.name,
      deviceStatus: result.deviceStatus ? "ENABLED" :"DISABLED",
      weightBridgeType: result.weightBridgeType,
      endPoint: result.endPoint,
      portNo: result.portNo ? +result.portNo : 0,
      baudRate: result.baudRate ? +result.baudRate : 0,
      dataBits: result.dataBits ? +result.dataBits : 0,
      parity: result.parity,
      stopBits: result.stopBits ? +result.stopBits : 0,   
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewDevice(newRecord).subscribe({
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
        newRecord.name = this.deviceData.name;
        this.httpService.updateDevice(newRecord).subscribe({
          next: (res: any) => {
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

  private _onFormValueChange() {
    const initialValue = this.weightForm.value;
    this.weightForm.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.weightForm.value[key] != initialValue[key]
      );
    });
  }
 

  private _setListData(): void {
    this.weighBridgeTypeList = GlobalConstants.commonFunction.getWeighBridgeType();
    const portNoControl = this.weightForm.get('portNo');
    const baudRateControl = this.weightForm.get('baudRate');
    const dataBitsControl = this.weightForm.get('dataBits');
    const parityControl = this.weightForm.get('parity');
    const stopBitsControl = this.weightForm.get('stopBits');
   
    this.portList = GlobalConstants.commonFunction.getPortList();
    this.baudRateList = GlobalConstants.commonFunction.getBaudRateList();
    this.dataBitsList = GlobalConstants.commonFunction.getDataBitsList();
    this.parityList = GlobalConstants.commonFunction.getParityList();
    this.stopBitsList = GlobalConstants.commonFunction.getStopBitsList();

    portNoControl?.clearValidators();
    portNoControl?.addValidators([
      Validators.maxLength(50),
      autocompleteObjectValidator(this.portList, 'key'),
    ]);
    portNoControl?.updateValueAndValidity();

    baudRateControl?.clearValidators();
    baudRateControl?.addValidators([
      Validators.maxLength(50),
      autocompleteObjectValidator(this.baudRateList, 'key'),
    ]);
    baudRateControl?.updateValueAndValidity();

    dataBitsControl?.clearValidators();
    dataBitsControl?.addValidators([
      Validators.maxLength(50),
      autocompleteObjectValidator(this.dataBitsList, 'key'),
    ]);
    dataBitsControl?.updateValueAndValidity();

    parityControl?.clearValidators();
    parityControl?.addValidators([
      Validators.maxLength(50),
      autocompleteObjectValidator(this.parityList, 'key'),
    ]);
    parityControl?.updateValueAndValidity();

    stopBitsControl?.clearValidators();
    stopBitsControl?.addValidators([
      Validators.maxLength(50),
      autocompleteObjectValidator(this.stopBitsList, 'key'),
    ]);
    stopBitsControl?.updateValueAndValidity();

    this.weightForm.controls['weightBridgeType'].setValue(this.weighBridgeTypeList[0].value);
  }

  private _setAutoCompleteControlData(): void {
    this.filteredPortList = this.weightForm
      .get('portNo')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.portList, item, 'key')
            : this.portList.slice()
        )
      );

    this.filteredBaudRateList = this.weightForm
      .get('baudRate')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.baudRateList, item, 'key')
            : this.baudRateList.slice()
        )
      );

    this.filteredDataBitsRateList = this.weightForm
      .get('dataBits')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.dataBitsList, item, 'key')
            : this.dataBitsList.slice()
        )
      );

    this.filteredParityList = this.weightForm
      .get('parity')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.parityList, item, 'key')
            : this.parityList.slice()
        )
      );

    this.filteredStopBitsList = this.weightForm
      .get('stopBits')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.stopBitsList, item, 'key')
            : this.stopBitsList.slice()
        )
      );
  }

  

  private _filterData(
    list: any,
    value: string,
    key: string,
    nameSearch: string = ''
  ): any[] {
    if (value === '') {
      return list.slice();
    }

    const filterValue = value?.toLowerCase();
    return list.filter(
      (item: any) =>
        item[key].toLowerCase().includes(filterValue) ||
        (nameSearch && item[nameSearch].toLowerCase().includes(filterValue))
    );
  }

  private _checkForDuplicateWeighBridges(weighBridgeType :string) :boolean{

    const count  = this.data?.data.deviceList.filter((d:WeighBridge) => d.deviceStatus === "ENABLED" &&  d.weightBridgeType ===weighBridgeType).length;

    if(count >3 ){
      const errorMsg = `Maximum allowed ${weighBridgeType } type are 4.`;
      this.alertService.error(errorMsg);
      return false;
    }

    return true;
  }
}

function autocompleteObjectValidator(listObj: any, keyName: string, ): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if(!control.value) { return null;}
    let index = listObj?.findIndex((obj: any) => obj[keyName] === control.value);
    if (index !== -1) {  return null; }

    return {     
      invalidData: { value: control.value } 
    };
  };
}
