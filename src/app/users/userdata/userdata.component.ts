import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
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
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.scss'],
})
export class UserDataComponent implements OnInit {
  signupForm: UntypedFormGroup;
  userData!: any;
  public staticText: any = {};
  userRoles: any = [];
  currentUserRole : number = -1;
  selectedRole: string = '';

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
    this._getCurrentUserRoleId(this.authenticationService.currentUserValue.role);
  
    this.signupForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required, Validators.maxLength(30)]],
    },{ validator: MustMatch('password', 'confirmPassword') });

    this.signupForm.patchValue({
      role: this.userRoles[0].value,
    });

    if (this.data.actionName !== 'add') {
      this.userData = this.data?.data;
      this.signupForm.controls['username'].setValue(this.userData?.username);
      this.signupForm.controls['email'].setValue(this.userData?.email);
      let userRole = this.userData?.role.toString().toLowerCase();
      userRole = userRole[0].toUpperCase() + userRole.slice(1);

      this.signupForm.controls['role'].setValue(userRole);
      this.selectedRole = userRole;

      if (this.data.actionName === 'view') {
        this.signupForm.controls['password']?.clearValidators();
        this.signupForm.controls['confirmPassword']?.clearValidators();
        this.signupForm.disable();
      }

      if (this.data.actionName === 'edit') {
        this.signupForm.controls['password']?.clearValidators();
        this.signupForm.controls['confirmPassword']?.clearValidators();
        this.signupForm.controls['password']?.disable();
        this.signupForm.controls['confirmPassword']?.disable();
        this.signupForm.controls['username'].disable();
        this.signupForm.addControl('needPassword', new FormControl(false));
      }
    }

    this._getTranslatedText();
    this._onFormValueChange();   
  }

  public close() {
    this.dialogRef.close();
  }

  public onChange(event:MatCheckboxChange): void {
    const password = this.signupForm.get('password'); 
    const confirmPassword = this.signupForm.get('confirmPassword'); 
  
    if(event.checked){
      password?.clearValidators();
      password?.addValidators([Validators.required, Validators.minLength(4), Validators.maxLength(15)]);
      confirmPassword?.clearValidators();
      password?.addValidators([Validators.required]);
      password?.enable();
      confirmPassword?.enable();
    }
    else {
      password?.clearValidators();
      confirmPassword?.clearValidators();
      password?.disable();
      confirmPassword?.disable();
    }

    password?.setValue('');
    confirmPassword?.setValue('');
    password?.updateValueAndValidity();
    confirmPassword?.updateValueAndValidity();
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
      username: this.userData?.username,
      role: this.selectedRole.toUpperCase()
    };

    if (this.data.actionName === 'add') {
      newRecord.password = result.password;
      newRecord.username =  result.username;
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
      if(result.needPassword) {
        newRecord.password = result.password;
      }
      if (this._hasChange) {
        newRecord.id = this.userData?.id;
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
        updatepassword: this.translate.instant('users.data.updatepassword'),

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
    const roleId = userRoles.find( (u:any) => u.key.toLowerCase() === roleName.toLowerCase())?.value || 0;
    this.currentUserRole = +roleId;
    this.userRoles = userRoles.filter((data: any) =>  data.value && +data.value <= +roleId);
    this.userRoles.forEach((data: any) => {
      data.key = this.translate.instant('users.role.'+data.key);
    });    
  }
 
}

  
