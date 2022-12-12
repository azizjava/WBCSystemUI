import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from '../common';

@Component({
  selector: 'app-weighbridgesetting',
  templateUrl: './weighbridgesetting.component.html',
  styleUrls: ['./weighbridgesetting.component.scss']
})
export class WeighbridgesettingComponent implements OnInit {

  firstWeightForm: UntypedFormGroup;
  secondWeightForm: UntypedFormGroup;

  portList: any = [];
  filteredPortList: Observable<any[]>;
  baudRateList: any = [];
  filteredBaudRateList: Observable<any[]>;

  secportList: any = [];
  secfilteredPortList: Observable<any[]>;
  secbaudRateList: any = [];
  secfilteredBaudRateList: Observable<any[]>;

  constructor(private _formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.firstWeightForm = this._formBuilder.group({
      weighBridge1: [true, []],
      weighBridge2: [false, []],
      portNo: ['', [Validators.required, Validators.maxLength(50)]],
      baudRate: ['', [Validators.required, Validators.maxLength(50)]],
      dataBits: ['', [Validators.required, Validators.maxLength(50)]],
      parity: ['', [Validators.required, Validators.maxLength(50)]],
      stopBits: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.secondWeightForm = this._formBuilder.group({
      weighBridge1: [true, []],
      weighBridge2: [false, []],
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

  updateAllComplete() {
  }

  private _setListData(): void {
    const portNoControl = this.firstWeightForm.get('portNo');
    const baudRateControl = this.firstWeightForm.get('baudRate');

    const portNoControl2 = this.secondWeightForm.get('portNo');
    const baudRateControl2 = this.secondWeightForm.get('baudRate');

    this.portList = this.secportList = GlobalConstants.commonFunction.getPortList();
    this.baudRateList = this.secbaudRateList = GlobalConstants.commonFunction.getBaudRateList();


    portNoControl?.clearValidators();
    portNoControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.portList, 'key')]);
    portNoControl?.updateValueAndValidity();

    baudRateControl?.clearValidators();
    baudRateControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.baudRateList, 'key')]);
    baudRateControl?.updateValueAndValidity();


    portNoControl2?.clearValidators();
    portNoControl2?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.secportList, 'key')]);
    portNoControl2?.updateValueAndValidity();

    baudRateControl2?.clearValidators();
    baudRateControl2?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.secbaudRateList, 'key')]);
    baudRateControl2?.updateValueAndValidity();
  }

  private _setAutoCompleteControlData() :void {
    this.filteredPortList = this.firstWeightForm.get('portNo')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.portList,item,"key") : this.portList.slice())),
    );

    this.filteredBaudRateList = this.firstWeightForm.get('baudRate')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.baudRateList,item,"key") : this.baudRateList.slice())),
    );
  }


  private _setAutoCompleteSecControlData() :void {
    this.secfilteredPortList = this.secondWeightForm.get('portNo')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.secportList,item,"key") : this.secportList.slice())),
    );

    this.secfilteredBaudRateList = this.secondWeightForm.get('baudRate')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.secbaudRateList,item,"key") : this.secbaudRateList.slice())),
    );
  }

  private _filterData(list:any, value: string,key :string, nameSearch:string =''): any[] {
    if (value === '') {
      return list.slice();
    }
    
    const filterValue = value?.toLowerCase();
    return list.filter((item :any) => item[key].toLowerCase().includes(filterValue) || nameSearch && item[nameSearch].toLowerCase().includes(filterValue) );
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
