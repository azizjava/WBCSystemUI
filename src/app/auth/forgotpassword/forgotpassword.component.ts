import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public userForm!: FormGroup;
  userDetails!: User;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(30), Validators.email]],

    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  onSubmit() {

    this.authenticationService.forgotPassword(this.f['email'].value)
      .pipe(first())
      .subscribe(
        data => {

          if (data) {
            
          }

        },
        error => {
          this.alertService.error(error);
        });


  }

}

