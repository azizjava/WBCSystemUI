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
import { AlertService } from 'src/app/services';

@Component({
  selector: 'app-driverdata',
  templateUrl: './driverdata.component.html',
  styleUrls: ['./driverdata.component.scss'],
})
export class DriverDataComponent implements OnInit {
  public form: UntypedFormGroup;
  public recordData!: Nationality;
  public staticText: any = {};

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<DriverDataComponent>,
    private translate: TranslateService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      driverNationality: ['', [Validators.required, Validators.maxLength(30)]],
    });

    if (this.data.actionName !== 'add') {
      this.recordData = this.data.data;
      this.form.controls['driverNationality'].setValue(
        this.recordData?.driverNationalityName
      );

      if (this.data.actionName === 'view') {
        this.form.disable();
      }
    }

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

    const newRecord: Nationality = {
      driverNationalityName: result.driverNationality,
    };

    this.dialogRef.close(newRecord);

    
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
