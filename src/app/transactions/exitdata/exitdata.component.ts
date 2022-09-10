import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';


@Component({
  selector: 'app-transactionexitdata',
  templateUrl: './exitData.component.html',
  styleUrls: ['./exitData.component.scss']
})
export class exitDataComponent implements OnInit {

  exitForm: FormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  productsList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.exitForm = this._formBuilder.group(
      {
        secondWeight: ['', [Validators.required, Validators.maxLength(50)]],
        dateOut: ['', [Validators.required, Validators.maxLength(50)]],
        timeOut: ['', [Validators.required, Validators.maxLength(50)]],
        deductWeight: ['', [Validators.required, Validators.maxLength(50)]],
        netWeight: ['', [Validators.required, Validators.maxLength(50)]],
        priceTons: ['', [Validators.required, Validators.maxLength(50)]],
        totalPrice: ['', [Validators.required, Validators.maxLength(50)]],
        loginUserName: ['', [Validators.required, Validators.maxLength(50)]],
        instructions: ['', [Validators.required, Validators.maxLength(50)]],
        deliveryNoteNo: ['', [Validators.required, Validators.maxLength(50)]],
        orderNo: ['', [Validators.required, Validators.maxLength(50)]],
       
      });
  }  

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.exitForm)) {
      return;
    }
  }
}
