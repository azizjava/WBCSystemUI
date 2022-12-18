import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from '../common';

@Component({
  selector: 'app-weighbridgesetting',
  templateUrl: './weighbridgesetting.component.html',
  styleUrls: ['./weighbridgesetting.component.scss'],
})
export class WeighbridgesettingComponent implements OnInit {
  firstWeightForm: UntypedFormGroup;
  secondWeightForm: UntypedFormGroup;

  weighBridgeList: any = [];

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

  constructor(private _formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.firstWeightForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
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
    this.secondWeightForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
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
    this._setAutoCompleteSecControlData();
  }

  updateAllComplete() {}

  public trackByFn(index: number, item: any) {
    return item;
  }

  onFirstWeightChkboxChange(event: MatCheckboxChange): void {
    const wb1 = this.firstWeightForm.get('wb01')?.value;
    const wb2 = this.firstWeightForm.get('wb02')?.value;
    const wb3 = this.firstWeightForm.get('wb03')?.value;
    const wb4 = this.firstWeightForm.get('wb04')?.value;

    if (wb1 || wb2 || wb3 || wb4) {
      const checkedCount = [wb1, wb2, wb3, wb4].filter((s) => s).length;
      this.btnSaveSettings = checkedCount > 1 ? true : false;
      this._enableDisableFormControls(
        this.btnSaveSettings,
        this.firstWeightForm
      );
      this.btnApplySettings = checkedCount > 0 ? false : true;
    } else {
      this.btnSaveSettings = true;
      this.btnApplySettings = true;
    }
  }

  onSecondWeightChkboxChange(event: MatCheckboxChange): void {
    const wb1 = this.secondWeightForm.get('wb01')?.value;
    const wb2 = this.secondWeightForm.get('wb02')?.value;
    const wb3 = this.secondWeightForm.get('wb03')?.value;
    const wb4 = this.secondWeightForm.get('wb04')?.value;

    if (wb1 || wb2 || wb3 || wb4) {
      const checkedCount = [wb1, wb2, wb3, wb4].filter((s) => s).length;
      this.secbtnSaveSettings = checkedCount > 1 ? true : false;
      this._enableDisableFormControls(
        this.secbtnSaveSettings,
        this.secondWeightForm
      );
      this.secbtnApplySettings = checkedCount > 0 ? false : true;
    } else {
      this.secbtnSaveSettings = true;
      this.secbtnApplySettings = true;
    }
  }

  private _enableDisableFormControls(
    isValid: boolean,
    weightForm: UntypedFormGroup
  ) {
    if (isValid) {
      weightForm.controls['name'].disable();
      weightForm.controls['url'].disable();
      weightForm.controls['portNo'].disable();
      weightForm.controls['baudRate'].disable();
      weightForm.controls['dataBits'].disable();
      weightForm.controls['parity'].disable();
      weightForm.controls['stopBits'].disable();
    } else {
      weightForm.controls['name'].enable();
      weightForm.controls['url'].enable();
      weightForm.controls['portNo'].enable();
      weightForm.controls['baudRate'].enable();
      weightForm.controls['dataBits'].enable();
      weightForm.controls['parity'].enable();
      weightForm.controls['stopBits'].enable();
    }
  }

  private _setListData(): void {
    // this.weighBridgeList = GlobalConstants.commonFunction.getWeighBridgesList();
    const portNoControl = this.firstWeightForm.get('portNo');
    const baudRateControl = this.firstWeightForm.get('baudRate');
    const dataBitsControl = this.firstWeightForm.get('dataBits');
    const parityControl = this.firstWeightForm.get('parity');
    const stopBitsControl = this.firstWeightForm.get('stopBits');

    const portNoControl2 = this.secondWeightForm.get('portNo');
    const baudRateControl2 = this.secondWeightForm.get('baudRate');
    const dataBitsControl2 = this.secondWeightForm.get('dataBits');
    const parityControl2 = this.secondWeightForm.get('parity');
    const stopBitsControl2 = this.secondWeightForm.get('stopBits');

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

    portNoControl2?.clearValidators();
    portNoControl2?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.secportList, 'key'),
    ]);
    portNoControl2?.updateValueAndValidity();

    baudRateControl2?.clearValidators();
    baudRateControl2?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.secbaudRateList, 'key'),
    ]);
    baudRateControl2?.updateValueAndValidity();

    dataBitsControl2?.clearValidators();
    dataBitsControl2?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.secdataBitsList, 'key'),
    ]);
    dataBitsControl2?.updateValueAndValidity();

    parityControl2?.clearValidators();
    parityControl2?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.secparityList, 'key'),
    ]);
    parityControl2?.updateValueAndValidity();

    stopBitsControl2?.clearValidators();
    stopBitsControl2?.addValidators([
      Validators.required,
      Validators.maxLength(50),
      autocompleteObjectValidator(this.secstopBitsList, 'key'),
    ]);
    stopBitsControl2?.updateValueAndValidity();
  }

  private _setAutoCompleteControlData(): void {
    this.filteredPortList = this.firstWeightForm
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

    this.filteredBaudRateList = this.firstWeightForm
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

    this.filteredDataBitsRateList = this.firstWeightForm
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

    this.filteredParityList = this.firstWeightForm
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

    this.filteredStopBitsList = this.firstWeightForm
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

  private _setAutoCompleteSecControlData(): void {
    this.secfilteredPortList = this.secondWeightForm
      .get('portNo')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.secportList, item, 'key')
            : this.secportList.slice()
        )
      );

    this.secfilteredBaudRateList = this.secondWeightForm
      .get('baudRate')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.secbaudRateList, item, 'key')
            : this.secbaudRateList.slice()
        )
      );

    this.secfilteredDataBitsRateList = this.secondWeightForm
      .get('dataBits')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.secdataBitsList, item, 'key')
            : this.secdataBitsList.slice()
        )
      );

    this.secfilteredParityList = this.secondWeightForm
      .get('parity')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.secparityList, item, 'key')
            : this.secparityList.slice()
        )
      );

    this.secfilteredStopBitsList = this.secondWeightForm
      .get('stopBits')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? value : undefined)),
        map((item: any) =>
          item
            ? this._filterData(this.secstopBitsList, item, 'key')
            : this.secstopBitsList.slice()
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
