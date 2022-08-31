import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';


import { AuthenticationService, AlertService, } from '../../services';

import { GlobalConstants } from '../../common/index';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { findInvalidControls } from 'src/app/helper';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  loading = false;  
  userLanguages: any = [];
  userRoles: any = [];

  constructor(
    private fb: FormBuilder,
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

    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
      phoneNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],      
      language: ['', [Validators.required, Validators.maxLength(30)]],
      role: ['', [Validators.required, Validators.maxLength(30)]],
    },
      { validator: MustMatch('password', 'confirmPassword') }
    );

    this.setDefaultValue();
  }

  setDefaultValue() {

    this.signupForm.patchValue({
      language: this.userLanguages[0].key,
      role: this.userRoles[1].key
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (!findInvalidControls(this.signupForm)) {
      return;
    }

    this.loading = true;

    //TODO Register new User
    this.loading = false;
  }

}
