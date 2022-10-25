import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/common';
import { CustomersService } from 'src/app/customer/Customers.service';
import { findInvalidControls } from 'src/app/helper';
import { Customer, Nationality, Product, Supplier, Transporter, Vehicle } from 'src/app/models';
import { NationalityService } from 'src/app/nationality/nationality.service';
import { ProductsService } from 'src/app/products/products.service';
import { AlertService, AuthenticationService } from 'src/app/services';
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
    private authenticationService: AuthenticationService,
    private zone: NgZone,
    ) {
      this.zone.runOutsideAngular(() => {
        setInterval(() => {
          this.entryForm.controls['timeIn'].setValue(GlobalConstants.commonFunction.getFormattedTime());
        }, 1000);
      });
    }

  ngOnInit(): void {

    this.entryForm = this._formBuilder.group(
      {
        sequenceNo: [0, [Validators.required, Validators.maxLength(50)]],      
        vehicleNo: ['', [Validators.required, Validators.maxLength(50)]],
        transporter: ['', [Validators.required, Validators.maxLength(50)]],
        supplier: ['', [Validators.required, Validators.maxLength(50)]],
        customer: ['', [Validators.maxLength(50)]], 
        products: ['', [Validators.required, Validators.maxLength(50)]],
        operator: [{value :this.authenticationService.currentUserValue.userName , disabled: true}],
        nationality: ['', [Validators.required, Validators.maxLength(50)]],
        pieces: ['', [Validators.required, Validators.maxLength(50)]],
        driverName: ['', [Validators.required, Validators.maxLength(50)]],
        licenceNo: ['', [Validators.required, Validators.maxLength(50)]],
        firstWeight: ['', [Validators.required, Validators.maxLength(50)]],
        dateIn: [{value :GlobalConstants.commonFunction.getFormattedDate(), disabled: true}],
        timeIn: [{value :GlobalConstants.commonFunction.getFormattedTime(),disabled: true}],
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

    const result = this.entryForm.value;

    const newRecord: any = {
      transporterCode: result.code,
      nameOfTransporter: result.name,
      contactPerson: result.contactPerson,
      mobileNo: result.mobileNo.toString(),
      telephoneNo: result.phoneNo.toString(),
      timeIn: GlobalConstants.commonFunction.getFormattedTime(),
      dateIn: GlobalConstants.commonFunction.getFormattedDate(),
      localCreatedDateTime: new Date(),
      lastModifiedByUser: this.authenticationService.currentUserValue.userName,
    };
  }

  addKeyValues() {
    if (this.keyValueData.length === 0) {
      this.emptyKeyValue = false;
      this.keyValueData.push({ key: '', value: '' });
    } else {
      this.emptyKeyValue = this.keyValueData.some((obj: any) => !obj.key);
      if (!this.emptyKeyValue) {
        this.keyValueData.push({ key: '', value: '' });
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

  public onChange(event:any) {
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

  onVehicleChange(event:any) {

    const supplierControl = this.entryForm.get('vehicleNo')?.value;

    this.getAllTransporters();
  }

  private populateListData(): void {    
    this.goodsList = GlobalConstants.commonFunction.getGoodsOption();
    this.getAllVehicles();
    this.getAllTransporters();
    this.getAllNationalities();
    this.getAllSuppliers();
    this.getAllProducts();
    this.getAllCustomers();
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
