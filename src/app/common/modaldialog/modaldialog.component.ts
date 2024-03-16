import { Component, OnInit, Inject, AfterViewInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { modelDialog, User } from 'src/app/models';

import { GlobalConstants} from '../../common/index';
import { findInvalidControls, MustMatch } from 'src/app/helper';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/users/users.service';
import { AlertService } from 'src/app/services';

declare var $: any; // declaring jquery in this way solved the problem

@Component({
  selector: 'app-modaldialog',
  templateUrl: './modaldialog.component.html',
  styleUrls: ['./modaldialog.component.scss'],
})
export class ModaldialogComponent implements OnInit, AfterViewInit {
  currentUser!: User;
  dialogForm!: UntypedFormGroup;
  userLanguages: any = [];
  public staticText: any = {};

  constructor(
    private dialogRef: MatDialogRef<ModaldialogComponent>,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private httpService: UsersService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    if (this.data.actionName === 'changePwd') {
      this.dialogForm = this.fb.group(
        {
          oldPassword: ['',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(15),
          ],],
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
    } else if (this.data.actionName === 'projectSetup') {
      const companyData = this.data.data;

      this.dialogForm = this.fb.group({
        name: ['', [Validators.maxLength(30)]],
        contactno: ['', [Validators.maxLength(30)]],
        date: ['', [Validators.maxLength(30)]],
        email: ['', [Validators.email]],
        address: ['', [Validators.maxLength(500)]],
        count: [0, [Validators.maxLength(30), Validators.pattern('^[0-9]*$')]],
        existingCount: [{ value: '', disabled: true }],
        startDate: [{ value: '', disabled: true }],
      });

      if (
        companyData !== null &&
        companyData !== undefined &&
        companyData?.code
      ) {
        let date = companyData?.endDate.toString().split('/');
        const endDate =
          date?.length > 2 ? new Date(date[2], date[1], date[0]) : new Date();

        this.dialogForm.controls['name'].setValue(companyData?.name);
        this.dialogForm.controls['contactno'].setValue(companyData?.contactNo);
        this.dialogForm.controls['date'].setValue(endDate);
        this.dialogForm.controls['email'].setValue(companyData?.emails);
        this.dialogForm.controls['address'].setValue(
          companyData?.companyAddress
        );
        this.dialogForm.controls['count'].setValue(companyData?.transCount);
        this.dialogForm.controls['existingCount'].setValue(
          companyData?.existingCount
        );
        this.dialogForm.controls['startDate'].setValue(companyData?.startDate);
      }
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
    const data = {
      newpassword: this.dialogForm.value.password,
      oldpassword: this.dialogForm.value.oldPassword,
    };

    this.httpService.changeUserPassword(data).subscribe({
      next: (res: any) => {
        this.alertService.success(this.staticText.passwordsuccess);
        this.dialogRef.close();
      },
      error: (error: any) => {
        if (error.text?.toLowerCase() === 'password successfully changed') {
          this.alertService.success(this.staticText.passwordsuccess);
          this.dialogRef.close();
        } else {
          console.log(error?.text);
          this.alertService.error(error?.text);
        }
      },
    });
  }

  saveProfile() {
    // stop here if form is invalid
    if (!findInvalidControls(this.dialogForm)) {
      return;
    }

    if (this.currentUser?.language !== this.f['language'].value) {
      this.translate.use(this.f['language'].value);

      let userInfo: User = this.currentUser;
      userInfo.language = this.f['language'].value;
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
    }

    this.dialogRef.close(this.dialogForm.value);
  }

  saveProject() {
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
        print: this.translate.instant('actions.print'),
        passwordtitle: this.translate.instant('changepassword.title'),
        password: this.translate.instant('changepassword.password'),
        oldpassword: this.translate.instant('changepassword.oldpassword'),
        confirmpassword: this.translate.instant('changepassword.confirmpassword'),
        passwordsuccess:this.translate.instant('changepassword.passwordsuccess'),
        projectsetuptitle: this.translate.instant('projectsetup.title'),
        emailerror: this.translate.instant('users.data.emailerror'),
        name: this.translate.instant('projectsetup.name'),
        contactno: this.translate.instant('projectsetup.contactno'),        
        date: this.translate.instant('projectsetup.date'),
        transcount: this.translate.instant('projectsetup.transcount'),
        address: this.translate.instant('projectsetup.address'),
        existingCount: this.translate.instant('projectsetup.existingcount'),
        startdate: this.translate.instant('projectsetup.startdate'),
        numbererror: this.translate.instant('projectsetup.numbererror'),
        printlayout: this.translate.instant('templatedata.printlayout'),
      };
    });
  }

  public ngAfterViewInit() :void {   
    $(document).ready(() => {
      if (this.data.actionName === 'printSetup' && this.data?.data) {
        this.formatTemplate(this.data.data);
      }
    });
  }

  public printLayout() {  
    window.print();    
  }  

  private formatTemplate(results: any) {
    try {
      // $('#panel-2').resizable();
      const panel2Size = results?.panel2Size;
      if (panel2Size) {
        $('#panel-2').css({
          width: panel2Size.width,
          height: panel2Size.height,
        });
      }

      const componentsData = results?.components;
      $('#panel-2 .dropped-in-panel2').remove();
      componentsData.forEach((data: any) => {
        let $newComponent;
        let text = data.text;
        if (data.type === 'label') {
          const orgLbl = data.text.split('=');
          if (orgLbl.length > 1) {
            text = orgLbl[1];
          }
          $newComponent = $(
            '<div class="predefined-label dropped-in-panel2"></div>'
          ).text(text);
        } else {
            if(data.text.indexOf("new QRCode(document.getElementById(")> -1) {
              const qrcodeDivIdMatch = data.text.match(/document.getElementById\("([^"]+)"\)/);
              if (qrcodeDivIdMatch && qrcodeDivIdMatch.length > 1) {
                const qrcodeDivId = qrcodeDivIdMatch[1];
                
                $newComponent = $(`<div class="draggable dropped-in-panel2"><div id="${qrcodeDivId}"></div></div>`);                      
                $(`<script>${data.text}</script>`).appendTo($newComponent);
              }
            }
            else {
              $newComponent = $(
                '<div class="draggable dropped-in-panel2"></div>'
              ).text(data.text);
    
              $(`<div class="card" style="height: 100%;">
                    <div class="card-header" style="height: 2.5rem;"></div>
                    <div class="card-body"></div>
                    </div>`).appendTo($newComponent);
            }          
        }

        $newComponent
          .css({
            top: data.top,
            left: data.left,
            width: data.width,
            height: data.height,
            background: data.background,
            border: data.border,
            position: 'absolute',
            'font-weight': data.fontWeight,
            'background-color' : data.backgroundColor,
          })
          .appendTo('#panel-2');

        // $newComponent.draggable({ containment: 'parent' }).resizable();

        // $newComponent.on('click', (event: any) => {
        //   $('.selected').removeClass('selected');
        //   $(event.target).addClass('selected');
        // });
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
}
