import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, startWith } from 'rxjs';
import { MustMatch, findInvalidControls } from 'src/app/helper';
import {
  modelDialog,
  Vehicle,
  TransporterList,
  Transporter,
  signup,
} from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { UsersService } from '../users.service';
import { GlobalConstants } from 'src/app/common';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.scss'],
})
export class UserDataComponent implements OnInit {
  signupForm: UntypedFormGroup;
  userData!: any;
  public staticText: any = {};
  userLanguages: any = [];
  userRoles: any = [];
  currentUserRole : number = -1;

  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<UserDataComponent>,
    private httpService: UsersService,
    private transportersService: TransportersService,
    private alertService: AlertService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.userLanguages = GlobalConstants.commonFunction.getUserLanguages();
    this._getCurrentUserRoleId(this.authenticationService.currentUserValue.role);
  
    this.signupForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
      language: ['', [Validators.required, Validators.maxLength(30)]],
      role: ['', [Validators.required, Validators.maxLength(30)]],
    },{ validator: MustMatch('password', 'confirmPassword') });

    this.signupForm.patchValue({
      language: this.userLanguages[0].key,
      role: this.userRoles[0].value,
    });

    if (this.data.actionName !== 'add') {
      this.userData = this.data?.data;
      this.signupForm.controls['username'].setValue(this.userData?.username);
      this.signupForm.controls['email'].setValue(this.userData?.email);
      this.signupForm.controls['role'].setValue(this.userData?.role?.id.toString());      

      if (this.data.actionName === 'view') {
        this.signupForm.disable();
      }     
    }

    this._getTranslatedText();
    this._onFormValueChange();   
  }

  public close() {
    this.dialogRef.close();
  }

  public trackByFn(index: number, item: any) {
    return item;
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.signupForm)) {
      return;
    }

    const result = this.signupForm.value;

    const newRecord: any = {
      email: result.email,
      password: result.password,
      username: result.userName,
      role: result.role
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewUser(newRecord).subscribe({
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
        newRecord.plateNo = this.userData?.id;
        this.httpService.updateUser(newRecord).subscribe({
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
        username: this.translate.instant('users.data.username'),
        email: this.translate.instant('users.data.email'),
        role: this.translate.instant('users.data.role'),
        password: this.translate.instant('users.data.password'),
        confirmpassword: this.translate.instant('users.data.confirmpassword'),
        emailerror: this.translate.instant('users.data.emailerror'),
        pwdminerror: this.translate.instant('users.data.pwdminerror'),
        pwdmaxerror: this.translate.instant('users.data.pwdmaxerror'),
        pwdmatch: this.translate.instant('users.data.pwdmatch'),
        language: this.translate.instant('users.data.language'),

        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
      };
    });
  }

  private _onFormValueChange() {
    const initialValue = this.signupForm.value;
    this.signupForm.valueChanges.subscribe((value) => {
      this._hasChange = Object.keys(initialValue).some(
        (key) => this.signupForm.value[key] != initialValue[key]
      );
    });
  }

  private _getCurrentUserRoleId(roleName:string) :void {
    const userRoles = GlobalConstants.commonFunction.getNewUserRoles();
    const roleId = userRoles.find( (u:any) => u.key === roleName)?.value || 0;
    this.currentUserRole = +roleId;
    this.userRoles = userRoles.filter((data: any) =>  data.value <= +roleId);
    this.userRoles.forEach((data: any) => {
      data.key = this.translate.instant('users.role.'+data.key);
    });    
  }
 
}

  
