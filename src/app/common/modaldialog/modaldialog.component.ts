import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { modelDialog, User } from 'src/app/models';

import { GlobalConstants} from '../../common/index';
import { findInvalidControls, MustMatch } from 'src/app/helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modaldialog',
  templateUrl: './modaldialog.component.html',
  styleUrls: ['./modaldialog.component.scss'],
})
export class ModaldialogComponent implements OnInit {
  currentUser!: User;
  dialogForm!: UntypedFormGroup;
  userLanguages: any = [];
  public staticText: any = {};

  constructor(
    private dialogRef: MatDialogRef<ModaldialogComponent>,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    if (this.data.actionName === 'changePwd') {
      this.dialogForm = this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(15),
            ],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validator: MustMatch('password', 'confirmPassword') }
      );
    } else if (this.data.actionName === 'viewProfile') {
      this.currentUser = this.data.data;

      this.userLanguages = GlobalConstants.commonFunction.getUserLanguages();

      this.dialogForm = this.fb.group({
        userName: ['', [Validators.required, Validators.maxLength(30)]],
        email: ['', [Validators.required, Validators.email]],
        language: ['', [Validators.required]],
      });

      // Set Values
      this.dialogForm.controls['userName'].setValue(this.currentUser?.userName);
      this.dialogForm.controls['email'].setValue(this.currentUser?.email);
      this.dialogForm.controls['language'].setValue(this.currentUser?.language);
    }

    this.getTranslatedText();

  }

 

  // convenience getter for easy access to form fields
  get f() {
    return this.dialogForm?.controls;
  }

  close() {
    this.dialogRef.close();
  }
  savePassword() {
    // stop here if form is invalid
    if (!findInvalidControls(this.dialogForm)) {
      return;
    }
    this.dialogRef.close(this.dialogForm.value);
  }

  saveProfile() {
    // stop here if form is invalid
    if (!findInvalidControls(this.dialogForm)) {
      return;
    }

    this.dialogRef.close(this.dialogForm.value);
  }

  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        username: this.translate.instant('login.username.label'),
        email: this.translate.instant('login.email.label'),
        language: this.translate.instant('login.language.label'),
        required: this.translate.instant('common.required'),
        update: this.translate.instant('actions.updateprofile'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
        passwordtitle: this.translate.instant('changepassword.title'),
        password: this.translate.instant('changepassword.password'),
        confirmpassword: this.translate.instant('changepassword.confirmpassword'),
      };
    });
  }
}
