import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, ProductGroup } from 'src/app/models';
import { AlertService } from 'src/app/services';
import { ProductGroupsService } from '../productgroups.service';

@Component({
  selector: 'app-productgroupdata',
  templateUrl: './productgroupdata.component.html',
  styleUrls: ['./productgroupdata.component.scss'],
})
export class ProductGroupDataComponent implements OnInit {
  form: FormGroup;
  productGroup!: any;
  public staticText: any = {};
  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductGroupDataComponent>,
    private httpService: ProductGroupsService,
    private alertService: AlertService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      groupCode: ['', [Validators.required, Validators.maxLength(30)]],
      groupName: ['', [Validators.required, Validators.maxLength(30)]],
    });

    if (this.data.actionName !== 'add') {
      this.productGroup = this.data.data;
      this.form.controls['groupCode'].setValue(this.productGroup?.groupCode);
      this.form.controls['groupName'].setValue(this.productGroup?.groupName);

      if (this.data.actionName === 'view') {
        this.form.disable();
      }
    }

    this._getTranslatedText();
    this._onFormValueChange();
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }

    const result = this.form.value;

    const newRecord: any = {
      groupCode: result.groupCode,
      groupName: result.groupName,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewProductGroup(newRecord).subscribe({
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
        newRecord.GroupCode = this.productGroup?.groupCode;
        this.httpService
          .updateProductGroup(newRecord.GroupCode, newRecord)
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
        groupcode: this.translate.instant('productgroups.tbl_header.groupcode'),
        groupname: this.translate.instant('productgroups.tbl_header.groupname'),  
        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
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
