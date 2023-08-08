import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';
import { findInvalidControls } from 'src/app/helper';
import { DriverInfo, modelDialog, Nationality } from 'src/app/models';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'app-driverdata',
  templateUrl: './driverdata.component.html',
  styleUrls: ['./driverdata.component.scss'],
})
export class DriverDataComponent implements OnInit {
  public form: UntypedFormGroup;
  public recordData!: DriverInfo;
  public staticText: any = {};
  filteredNationalityList: Observable<any[]>;
  private _hasChange: boolean = false;
  nationalityList: any = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<DriverDataComponent>,
    private translate: TranslateService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      nationality: ['', [Validators.required, Validators.maxLength(50)]],
      driverName: ['', [Validators.maxLength(50)]],
      licenseNo: ['', [Validators.required, Validators.maxLength(50)]],
    });

    if (this.data?.data) {
      this.recordData = this.data.data;
      this.form.controls['nationality'].setValue(this.recordData.nationality);
      this.form.controls['driverName'].setValue(this.recordData.driverName);
      this.form.controls['licenseNo'].setValue(this.recordData.licenseNo);
      this.nationalityList = this.data.data?.nationalityList;
      this.form.get('nationality')?.setValue(
        this._getSelectedValue(this.nationalityList,this.data.data?.nationalityId,"driverNationalityCode" ,"driverNationalityName" ),
      );
      this.form.get('nationality')?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.nationalityList, 'driverNationalityName')]);
    }

    this._setAutoCompleteNationalityData();
    this._getTranslatedText();
    this._onFormValueChange();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }

    const result = this.form.value;
   
    this.dialogRef.close({
      nationality: result.nationality,
      licenseNo: result.licenseNo,
      driverName:result.driverName,
      nationalityId : this._getSelectedValue(this.nationalityList,result.nationality,"driverNationalityName", "driverNationalityCode"),
    });
  }

  private _setAutoCompleteNationalityData() :void {
    this.filteredNationalityList = this.form.get('nationality')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.nationalityList,item,"driverNationalityName") : this.nationalityList.slice())),
    );
  }

  private _filterData(list:any, value: string,key :string, nameSearch:string =''): any[] {
    if (value === '') {
      return list.slice();
    }
    
    const filterValue = value?.toLowerCase();
    return list.filter((item :any) => item[key].toLowerCase().includes(filterValue) || nameSearch && item[nameSearch].toLowerCase().includes(filterValue) );
  }

  private _getSelectedValue(list:any, value: string, key :string, returnKey:string): string {
    if (list) {
      const filterValue = value?.toLowerCase();
      const filterList = list.find((item: any) =>
        item[key].toString().toLowerCase().includes(filterValue)
      );
      return (filterList && filterList[returnKey]) ?? '';
    }
    return "";
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        nationality: this.translate.instant(
          'nationality.tbl_header.drivernationality'
        ),
      };
    });
  }

  private _onFormValueChange() {
    const initialValue = this.form.value;
    this.form.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.form.value[key] != initialValue[key]
      );
    });
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
