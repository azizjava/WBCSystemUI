import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { modelDialog, User } from 'src/app/models';

import { GlobalConstants} from '../../common/index';
import { findInvalidControls, MustMatch } from 'src/app/helper';

@Component({
  selector: 'app-modaldialog',
  templateUrl: './modaldialog.component.html',
  styleUrls: ['./modaldialog.component.scss'],
})
export class ModaldialogComponent implements OnInit {
  currentUser!: User;
  dialogForm!: FormGroup;
  minDate!: Date;
  maxDate!: Date;
  userLanguages: any = [];

  constructor(
    private dialogRef: MatDialogRef<ModaldialogComponent>,
    private fb: FormBuilder,
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

      [this.minDate,this.maxDate] = GlobalConstants.commonFunction.getMinMaxDate();

      this.dialogForm = this.fb.group(
        {
          firstName: ['', [Validators.required, Validators.maxLength(30)]],
          lastName: ['', [Validators.required, Validators.maxLength(30)]],
          email: ['', [Validators.required, Validators.email]],
          phoneNo: ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
          dob: ['', [Validators.required]],
          language: ['', [Validators.required]],
        });

   // Set Values
   this.dialogForm.controls["firstName"].setValue(this.currentUser?.firstName);
   this.dialogForm.controls["lastName"].setValue(this.currentUser?.lastName);
   this.dialogForm.controls["email"].setValue(this.currentUser?.email);
   this.dialogForm.controls["language"].setValue(this.currentUser?.language);
  }

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
}
