import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls } from 'src/app/helper';

@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entrydata.component.html',
  styleUrls: ['./entrydata.component.scss']
})
export class entryDataComponent implements OnInit {

  entryForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  customersList: any = [];
  productsList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];
  goodsList: any = [];
  keyValueData: any =[];
  emptyKeyValue:boolean =false;

  selectedGood:string='';
 

  constructor(private _formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {

    this.entryForm = this._formBuilder.group(
      {
        sequenceNo: [0, [Validators.required, Validators.maxLength(50)]],      
        vehicleNo: ['', [Validators.required, Validators.maxLength(50)]],
        transporter: ['', [Validators.required, Validators.maxLength(50)]],
        supplier: ['', [Validators.required, Validators.maxLength(50)]],
        customer: ['', [Validators.maxLength(50)]], 
        products: ['', [Validators.required, Validators.maxLength(50)]],
        operator: ['', [Validators.required, Validators.maxLength(50)]],
        nationality: ['', [Validators.required, Validators.maxLength(50)]],
        pieces: ['', [Validators.required, Validators.maxLength(50)]],
        driverName: ['', [Validators.required, Validators.maxLength(50)]],
        licenceNo: ['', [Validators.required, Validators.maxLength(50)]],
        firstWeight: ['', [Validators.required, Validators.maxLength(50)]],
        dateIn: [GlobalConstants.commonFunction.getFormattedDate()],
        timeIn: [GlobalConstants.commonFunction.getFormattedTime()],
        instructions: ['', [Validators.maxLength(250)]],
       
      });

      this.populateListData();
      this.selectedGood = this.goodsList[0].key;
  }  

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }
  }

  addKeyValues() {

    if(this.keyValueData.length ===0){
      this.emptyKeyValue = false;
      this.keyValueData.push({ key :'', value:''});
    }

    else {

      this.emptyKeyValue =this.keyValueData.some((obj:any) =>  !obj.key || !obj.value);
      if(!this.emptyKeyValue){
        this.keyValueData.push({ key :'', value:''});
      }

    }
  }


  edit() {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }
  }

  public trackByFn(index: number, item: any) {
    return item;
}

  onChange(event:any) {
    console.log(this.selectedGood);

    const supplierControl = this.entryForm.get('supplier');
    const customerControl = this.entryForm.get('customer');

    if(this.selectedGood ==='incoming'){
      supplierControl?.setValidators([Validators.required]);
      customerControl?.setValidators(null);
    }
    else{
      customerControl?.setValidators([Validators.required]);
      supplierControl?.setValidators(null);
    }
  }

  private populateListData(): void {    
    this.nationalityList = GlobalConstants.commonFunction.getNationalityList();
    this.goodsList = GlobalConstants.commonFunction.getGoodsOption();

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
        Id: 'S-2',
        Code: 'Supplier-2',
      },
      {
        Id: 'S-3',
        Code: 'Supplier-3',
      },
      {
        Id: 'S-4',
        Code: 'Supplier-4',
      },
      {
        Id: 'S-5',
        Code: 'Supplier-5',
      },
    ];

    this.customersList = [
      {
        Id: 'C-1',
        Code: 'Customer-1',
      },
      {
        Id: 'C-2',
        Code: 'Customer-2',
      },
      {
        Id: 'C-3',
        Code: 'Customer-3',
      },
      {
        Id: 'C-4',
        Code: 'Customer-4',
      },
      {
        Id: 'C-5',
        Code: 'Customer-5',
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
