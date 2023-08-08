import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Nationality } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { NationalityService } from '../nationality.service';

@Component({
  selector: 'app-nationalitydata',
  templateUrl: './nationalitydata.component.html',
  styleUrls: ['./nationalitydata.component.scss'],
})
export class NationalityDataComponent implements OnInit {
  public form: UntypedFormGroup;
  public recordData!: Nationality;
  public staticText: any = {};

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<NationalityDataComponent>,
    private translate: TranslateService,
    private httpService: NationalityService,
    private authenticationService: AuthenticationService,
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

    if (this.data.actionName === 'add') {
      this.httpService.createNewNationality(newRecord).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else if (this.data.actionName === 'edit') {
      if (this._hasChange) {
        this.httpService
          .updateNationality(this.recordData?.driverNationalityName, newRecord)
          .subscribe({
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
