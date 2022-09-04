import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Transporter } from 'src/app/models';


@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entryData.component.html',
  styleUrls: ['./entryData.component.scss']
})
export class entryDataComponent implements OnInit {

  entryForm: FormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  productsList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.entryForm = this._formBuilder.group(
      {
        vehicleNo: ['', [Validators.required, Validators.maxLength(50)]],
        transporter: ['', [Validators.required, Validators.maxLength(50)]],
        supplier: ['', [Validators.required, Validators.maxLength(50)]],
        products: ['', [Validators.required, Validators.maxLength(50)]],
        operator: ['', [Validators.required, Validators.maxLength(50)]],
        nationality: ['', [Validators.required, Validators.maxLength(50)]],
        pieces: ['', [Validators.required, Validators.maxLength(50)]],
        driverName: ['', [Validators.required, Validators.maxLength(50)]],
        licenceNo: ['', [Validators.required, Validators.maxLength(50)]],
        firstWeight: ['', [Validators.required, Validators.maxLength(50)]],
        dateIn: ['', [Validators.required, Validators.maxLength(50)]],
        timeIn: ['', [Validators.required, Validators.maxLength(50)]],
       
      });

      this.populateListData();
  }  

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }
  }

  private populateListData(): void {    
    this.nationalityList = GlobalConstants.commonFunction.getNationalityList();

    /* TODO */
    /* Need to relace with actual data */

    this.vehicleList = [
      {
        Id: 'V-1',
        PlateNo: 'Vehicle-01',
      },
      {
        Id: 'V-2',
        PlateNo: 'Vehicle-02',
      },
      {
        Id: 'V-3',
        PlateNo: 'Vehicle-03',
      },
      {
        Id: 'V-4',
        PlateNo: 'Vehicle-04',
      },

      {
        Id: 'V-5',
        PlateNo: 'Vehicle-05',
      },
     
    ];

    this.transportersList = [
      {
        Id: 'T-1',
        Code: 'Transporter-1',
      },
      {
        Id: 'T-2',
        Code: 'Transporter-2',
      },
      {
        Id: 'T-3',
        Code: 'Transporter-3',
      },
      {
        Id: 'T-4',
        Code: 'Transporter-4',
      },
      {
        Id: 'T-5',
        Code: 'Transporter-5',
      },
    ];

    this.suppliersList = [
      {
        Id: 'S-1',
        Code: 'Supplier-1',
      },
      {
        Id: 'T-2',
        Code: 'Supplier-2',
      },
      {
        Id: 'T-3',
        Code: 'Supplier-3',
      },
      {
        Id: 'T-4',
        Code: 'Supplier-4',
      },
      {
        Id: 'T-5',
        Code: 'Supplier-5',
      },
    ];

    this.productsList = [
      {
        Id: 'P-1',
        Code: 'Product-1',
      },
      {
        Id: 'P-2',
        Code: 'Product-2',
      },
      {
        Id: 'P-3',
        Code: 'Product-3',
      },
      {
        Id: 'P-4',
        Code: 'Product-4',
      },
      {
        Id: 'P-5',
        Code: 'Product-5',
      },
    ];

    this.operatorIDList = [
      {
        Id: 'OP-1',
        Code: 'Operator-1',
      },
      {
        Id: 'OP-2',
        Code: 'Operator-2',
      },
      {
        Id: 'OP-3',
        Code: 'Operator-3',
      },
      {
        Id: 'OP-4',
        Code: 'Operator-4',
      },
      {
        Id: 'OP-5',
        Code: 'Operator-5',
      },
    ];
  }

}
