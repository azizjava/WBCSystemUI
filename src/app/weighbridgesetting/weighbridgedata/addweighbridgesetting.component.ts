import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';

@Component({
  selector: 'app-weighbridgesetting',
  templateUrl: './addweighbridgesetting.component.html',
  styleUrls: ['./addweighbridgesetting.component.scss'],
})
export class AddWeighbridgesettingComponent implements OnInit {
  weightForm: UntypedFormGroup;

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
  btnSaveSettings: boolean = false;
  btnApplySettings: boolean = false;

  secportList: any = [];
  secfilteredPortList: Observable<any[]>;
  secbaudRateList: any = [];
  secfilteredBaudRateList: Observable<any[]>;
  secdataBitsList: any = [];
  secfilteredDataBitsRateList: Observable<any[]>;
  secparityList: any = [];
  secfilteredParityList: Observable<any[]>;
  secstopBitsList: any = [];
  secfilteredStopBitsList: Observable<any[]>;
  secbtnSaveSettings: boolean = false;
  secbtnApplySettings: boolean = false;  

  constructor(private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddWeighbridgesettingComponent>,) {}

  public ngOnInit(): void {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.weightForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      enabled: [false, [Validators.required, Validators.maxLength(50)]],
      type:['', [Validators.required, Validators.maxLength(50)]],
      url: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(reg),
        ],
      ],
      wb01: [true, []],
      wb02: [false, []],
      wb03: [false, []],
      wb04: [false, []],
      portNo: ['', [Validators.required, Validators.maxLength(50)]],
      baudRate: ['', [Validators.required, Validators.maxLength(50)]],
      dataBits: ['', [Validators.required, Validators.maxLength(50)]],
      parity: ['', [Validators.required, Validators.maxLength(50)]],
      stopBits: ['', [Validators.required, Validators.maxLength(50)]],
    });

    this._setListData();
    this._setAutoCompleteControlData();
  }

  updateAllComplete() {}

  public trackByFn(index: number, item: any) {
    return item;
  }

  public close() {
    this.dialogRef.close();
  }

  public reset() {
    this.weightForm.markAsPristine();
    this.weightForm.markAsUntouched();
    this.weightForm.reset();
  }
 

  private _setListData(): void {
    this.weighBridgeTypeList = GlobalConstants.commonFunction.getWeighBridgeType();
    const portNoControl = this.weightForm.get('portNo');
    const baudRateControl = this.weightForm.get('baudRate');
    const dataBitsControl = this.weightForm.get('dataBits');
    const parityControl = this.weightForm.get('parity');
    const stopBitsControl = this.weightForm.get('stopBits');
   
    this.portList = this.secportList =
      GlobalConstants.commonFunction.getPortList();
    this.baudRateList = this.secbaudRateList =
      GlobalConstants.commonFunction.getBaudRateList();
    this.dataBitsList = this.secdataBitsList =
      GlobalConstants.commonFunction.getDataBitsList();
    this.parityList = this.secparityList =
      GlobalConstants.commonFunction.getParityList();
    this.stopBitsList = this.secstopBitsList =
      GlobalConstants.commonFunction.getStopBitsList();

    portNoControl?.clearValidators();
    portNoControl?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.portList, 'key'),
    ]);
    portNoControl?.updateValueAndValidity();

    baudRateControl?.clearValidators();
    baudRateControl?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.baudRateList, 'key'),
    ]);
    baudRateControl?.updateValueAndValidity();

    dataBitsControl?.clearValidators();
    dataBitsControl?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.dataBitsList, 'key'),
    ]);
    dataBitsControl?.updateValueAndValidity();

    parityControl?.clearValidators();
    parityControl?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.parityList, 'key'),
    ]);
    parityControl?.updateValueAndValidity();

    stopBitsControl?.clearValidators();
    stopBitsControl?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.stopBitsList, 'key'),
    ]);
    stopBitsControl?.updateValueAndValidity();

    this.weightForm.controls['type'].setValue(this.weighBridgeTypeList[0].value);
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
