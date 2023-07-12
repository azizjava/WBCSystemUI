import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { Customer, modelDialog, Transporter } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { ClientTemplateService } from './Clienttemplate.service';
import { ClientTemplate, TemplateType } from 'src/app/models/clienttemplate.model';
import { MatRadioChange } from '@angular/material/radio';


@Component({
  selector: 'app-clienttemplate',
  templateUrl: './clienttemplate.component.html',
  styleUrls: ['./clienttemplate.component.scss'],
})
export class ClientTemplateComponent implements OnInit {
  form: UntypedFormGroup;
  ClientTemplateData!: ClientTemplate;
  public staticText: any = {};
  public templateType: any = [];
  public showFileUpload :boolean = false;
  public fileUploaded :boolean = false;
  public selectedFile: File|null;
  public isFileUploadRequired : boolean = false;
  private _hasChange: boolean = false;

  @ViewChild('inputFile') myInputVariable: ElementRef;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ClientTemplateComponent>,
    private translate: TranslateService,
    private httpService: ClientTemplateService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,    
  ) {}

  ngOnInit(): void {
    
    this.templateType = [
      { name: 'plain', value: TemplateType.PLAIN, checked: true },
      { name: 'header', value: TemplateType.HEADER, checked: false },
      { name: 'logo', value: TemplateType.LOGO, checked: false },
    ];

    this.form = this._formBuilder.group({
      city: [''],
      companyName: ['', [Validators.required, Validators.maxLength(30)]],
      templateType:[''],
      phoneNo: [''],
      zipCode: [''],
      streetAddress: [''],
      email: ['', [Validators.required, Validators.maxLength(30)]],
      companyLogo: [null]   
    });
    this.getAllClientDetails();

    this._getTranslatedText();
  }

  close() {
    this.dialogRef.close();
  }

  public trackByFn(index: number, item: any) {
    return item.value;
  }

  public onReportTypeChange(event: MatRadioChange) {
    this.form.controls['templateType'].setValue(event.value);
    this.showFileUpload = event.value === TemplateType.PLAIN ? false : true;
    this.fileUploaded = false;
    this.selectedFile = null;
    if(this.myInputVariable){
      this.myInputVariable.nativeElement.value = '';
    }
    this.ClientTemplateData.companyLogo = null;
    this.isFileUploadRequired = this.showFileUpload ;
  }

  public onFileChange(event:any) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = file;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.form.controls['companyLogo'].setValue(reader.result);
        this.ClientTemplateData.companyLogo = reader.result;
        this.fileUploaded = true;
        this.isFileUploadRequired = false;
      };
    }
  }

  save() {
    // stop here if form is invalid

    if(this.showFileUpload && (!this.ClientTemplateData.companyLogo)){
      this.isFileUploadRequired =true;
      return;
    }

    if (!findInvalidControls(this.form)) {
      return;
    }

    const result = this.form.value;
    var formData: any = new FormData();
    formData.append('companyLogo', null);
    formData.append('clientDetailsRequest', JSON.stringify({
      city: result.city,
      companyName: result.companyName,
      email: result.email,
      localCreatedDateTime: new Date(),
      phoneNo: result.phoneNo.toString(),
      streetAddress: result.streetAddress,
      templateType: result.templateType,
      zipCode: result.zipCode,
      lastModifiedByUser: this.authenticationService.currentUserValue.userName,
    }));

    if(this.selectedFile != undefined){
      formData.append('companyLogo', this.selectedFile);
    }


    this.httpService.createNewClientDetails(formData).subscribe({
      next: (res: any) => {
        this.dialogRef.close(res);
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
    }
  
  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        companyName: this.translate.instant('reports.clienttemplate.companyname'),
        email: this.translate.instant('reports.clienttemplate.email'),
        zipCode: this.translate.instant('reports.clienttemplate.zipcode'),
        city: this.translate.instant('reports.clienttemplate.city'),
        phoneNo: this.translate.instant('reports.clienttemplate.phoneno'),
        templateType: this.translate.instant('reports.clienttemplate.templatetype'),
        companyLogo: this.translate.instant('reports.clienttemplate.logo'),
        image: this.translate.instant('reports.clienttemplate.image'),
        faxNo: this.translate.instant('reports.clienttemplate.'),
        streetAddress: this.translate.instant('reports.clienttemplate.address'),

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

  private getAllClientDetails(): void {
    this.httpService.getAllClientDetails().subscribe({
      next: (data: ClientTemplate[]) => {
        this._bindData( data && data.length >0 ? data[0] : new ClientTemplate());
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private _bindData(data: ClientTemplate){
      this.ClientTemplateData = data;
      this.ClientTemplateData.clientID = data.clientID || 0;
      this.form.controls['companyName'].setValue(this.ClientTemplateData?.companyName);
      this.form.controls['email'].setValue(this.ClientTemplateData?.email);
      this.form.controls['city'].setValue(this.ClientTemplateData?.city);
      this.form.controls['phoneNo'].setValue(this.ClientTemplateData?.phoneNo);
      this.form.controls['streetAddress'].setValue(this.ClientTemplateData?.streetAddress);
      this.form.controls['zipCode'].setValue(this.ClientTemplateData?.zipCode);
      this.form.controls['templateType'].setValue(this.ClientTemplateData?.templateType); 
      this.showFileUpload = this.ClientTemplateData?.templateType === TemplateType.PLAIN ? false : true;
      this.templateType.forEach((element :any) => {
        element.checked = element.value === this.ClientTemplateData?.templateType ;        
      });
  }
}
