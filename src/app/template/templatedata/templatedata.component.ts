import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Nationality } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { TemplateService } from '../template.service';

@Component({
  selector: 'app-templatedata',
  templateUrl: './templatedata.component.html',
  styleUrls: ['./templatedata.component.scss'],
})
export class TemplateDataComponent implements OnInit {
  public form: UntypedFormGroup;
  public recordData!: Nationality;
  public staticText: any = {};

  private _hasChange: boolean = false;

  row = [
    {
      id : '',
      name: '',
      email: ''
    },
    {
      id : '',
      name: '',
      email: ''
    },
    {
      id : '',
      name: '',
      email: ''
    }
  ];
  
  

  constructor(
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {  
    this._getTranslatedText();
    this._onFormValueChange();
  }

  addTable() {
    const obj = {
      id: '',
      name: '',
      email: ''
    }
    this.row.push(obj)
  }
  
  deleteRow(x: number){
    var delBtn = confirm(" Do you want to delete ?");
    if ( delBtn == true ) {
      this.row.splice(x, 1 );
    }   
  } 

  close() {
  }

  save() {
  
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        nationality: this.translate.instant('nationality.tbl_header.drivernationality'),
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
