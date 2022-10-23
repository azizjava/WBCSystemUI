import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/common';
import { CustomersService } from 'src/app/customer/Customers.service';
import { findInvalidControls } from 'src/app/helper';
import { Customer, Nationality, Product, Supplier, Transporter, Vehicle } from 'src/app/models';
import { NationalityService } from 'src/app/nationality/nationality.service';
import { ProductsService } from 'src/app/products/products.service';
import { AlertService } from 'src/app/services';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { VehiclesService } from 'src/app/vehicles/vehicles.service';

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
 

  constructor(private _formBuilder: UntypedFormBuilder,
    private transporterService: TransportersService,
    private vehiclesService: VehiclesService,
    private productService: ProductsService,
    private nationalityService: NationalityService,
    private alertService : AlertService,
    private supplierService: SuppliersService,
    private customerService: CustomersService,
    ) { }

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
    this.goodsList = GlobalConstants.commonFunction.getGoodsOption();
    this.getAllVehicles();
    this.getAllTransporters();
    this.getAllNationalities();
    this.getAllSuppliers();
    this.getAllProducts();
    this.getAllCustomers();

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

  private getAllVehicles(): void {
    this.vehiclesService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicleList = data;       
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllTransporters(): void {
    this.transporterService.getAllTransporters().subscribe({
      next: (data: Transporter[]) => {
        this.transportersList = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllNationalities(): void {
    this.nationalityService.getAllDriverNationalities().subscribe({
      next: (data: Nationality[]) => {
        this.nationalityList = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliersList = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.productsList = data;       
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customersList = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

}
