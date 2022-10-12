import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';


import { AuthenticationService, AlertService, } from '../../services';

import { GlobalConstants } from '../../common/index';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { findInvalidControls } from 'src/app/helper';
import { signup } from 'src/app/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm: UntypedFormGroup;
  loading = false;  
  userLanguages: any = [];
  userRoles: any = [];
  passwordResetQuestion: any = [];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {

    this.userLanguages = GlobalConstants.commonFunction.getUserLanguages();
    this.userRoles = GlobalConstants.commonFunction.getUserRoles();
    this.passwordResetQuestion = GlobalConstants.commonFunction.getPasswordResetQuestion();

    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
      language: ['', [Validators.required, Validators.maxLength(30)]],
      role: ['', [Validators.required, Validators.maxLength(30)]],
      passwordResetQuestion: ['', [Validators.required, Validators.maxLength(250)]],
      passwordResetAnswer: ['',  [Validators.required, Validators.maxLength(250), ]],
    },
      { validator: MustMatch('password', 'confirmPassword') }
    );
    this.signupForm.controls['passwordResetAnswer'].disable();
    this.setDefaultValue();
  }

  setDefaultValue() {

    this.signupForm.patchValue({
      language: this.userLanguages[0].key,
      role: this.userRoles[1].key
    })
  }

  onSelectionChanged(value : any) {
    this.signupForm.controls['passwordResetAnswer'].enable();
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {

    // stop here if form is invalid
    if (!findInvalidControls(this.signupForm)) {
      return;
    }

    this.loading = true;
    const result =this.signupForm.value;
    const newUser: signup = {
      email: result.email, password: result.password, username: result.userName, role: [result.role]
    };

    this.authenticationService.signup(newUser).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([GlobalConstants.ROUTE_URLS.login]);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMsg =error?.error?.message;
        console.log(errorMsg);
        this.alertService.error(errorMsg);
      }
    });
    
  }

}
