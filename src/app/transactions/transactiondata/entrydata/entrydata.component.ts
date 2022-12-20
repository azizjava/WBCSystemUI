import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { CustomerdataComponent } from 'src/app/customer/customerdata/customerdata.component';
import { CustomersService } from 'src/app/customer/Customers.service';
import { CustomerProductsService } from 'src/app/customerproducts/customerproducts.service';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { Customer, modelDialog, Nationality, Product, Supplier, Transporter, Vehicle } from 'src/app/models';
import { NationalityService } from 'src/app/nationality/nationality.service';
import { AlertService, AuthenticationService } from 'src/app/services';
import { SupplierProductsService } from 'src/app/supplierproducts/products.service';
import { SupplierdataComponent } from 'src/app/suppliers/supplierdata/supplierdata.component';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { VehicleDataComponent } from 'src/app/vehicles/vehicledata/vehicledata.component';
import { VehiclesService } from 'src/app/vehicles/vehicles.service';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entrydata.component.html',
  styleUrls: ['./entrydata.component.scss'],
})
export class entryDataComponent implements OnInit, OnChanges {
  @Input() weight: number = 0;
  @Input() sequenceno: string = '';
  @Input() transactionData: any;


  entryForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  customersList: any = [];
  productsList: any = [];
  nationalityList: any = [];
  goodsList: any = [];
  keyValueData: any = [];
  emptyKeyValue: boolean = false;

  filteredVehicleList: Observable<any[]>;
  filteredProductsList: Observable<any[]>;
  filteredSupplierList: Observable<any[]>;
  filteredCustomerList: Observable<any[]>;
  filteredNationalityList: Observable<any[]>;
  selectedGood: string = '';
  suppProductsList: any = [];
  custProductsList: any = [];

  constructor(
    private httpService: TransactionsService,
    private _formBuilder: UntypedFormBuilder,
    private transporterService: TransportersService,
    private vehiclesService: VehiclesService,
    private custProductService: CustomerProductsService,
    private suppProductService: SupplierProductsService,
    private nationalityService: NationalityService,
    private alertService: AlertService,
    private supplierService: SuppliersService,
    private customerService: CustomersService,
    private authenticationService: AuthenticationService,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
  ) {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this.entryForm.controls['timeIn'].setValue(
          GlobalConstants.commonFunction.getFormattedTime()
        );
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.entryForm = this._formBuilder.group({
      sequenceNo: [{
        value: 0,
        disabled: true,
      } ],
      vehicleNo: ['', [Validators.required, Validators.maxLength(50)]],
      transporter: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],
      transporterName: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],

      supplier: ['', [Validators.required, Validators.maxLength(50)]],
      supplierName: ['', [Validators.maxLength(50)]],
      customer: ['', [Validators.maxLength(50)]],
      customerName: ['', [Validators.maxLength(50)]],
      products: ['', [Validators.required, Validators.maxLength(50)]],
      operator: [
        {
          value: this.authenticationService.currentUserValue.userName,
          disabled: true,
        },
      ],
      role: [
        {
          value: this.authenticationService.currentUserValue.role,
          disabled: true,
        },
      ],
      nationality: ['', [Validators.required, Validators.maxLength(50)]],
      pieces: ['', [Validators.maxLength(50), patternNumberValidator()]],
      driverName: ['', [Validators.required, Validators.maxLength(50)]],
      licenceNo: ['', [Validators.required, Validators.maxLength(50)]],
      firstWeight: ['', [Validators.required, Validators.maxLength(50)]],
      dateIn: [
        {
          value: GlobalConstants.commonFunction.getFormattedDate(),
          disabled: true,
        },
      ],
      timeIn: [
        {
          value: GlobalConstants.commonFunction.getFormattedTime(),
          disabled: true,
        },
      ],
      instructions: ['', [Validators.maxLength(250)]],
    });
    this.populateListData();
    this.selectedGood = this.goodsList[0].key;
    this.keyValueData.push({ name: '', value: '' });

    this.entryForm.get('vehicleNo')?.statusChanges.subscribe(v => 
      {
        if(v ==='INVALID'){
          this.entryForm.controls['transporter'].setValue('');
          this.entryForm.controls['transporterName'].setValue('');
          this.entryForm.controls['firstWeight'].setValue('');
        }
      });

      this.entryForm.controls['supplier']?.valueChanges.subscribe(value => {
        if(this.entryForm.controls['supplier']?.hasError('invalidData')){
          this.entryForm.controls['supplierName'].setValue("");
        }
      });
      this.entryForm.controls['customer']?.valueChanges.subscribe(value => {
        if(this.entryForm.controls['customer']?.hasError('invalidData')){
          this.entryForm.controls['customerName'].setValue("");
        }
      });
      
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['weight'] && !changes['weight']?.firstChange) {
      this.entryForm.controls['firstWeight'].setValue(changes['weight'].currentValue);
    }

    if (changes['transactionData'] && !changes['transactionData']?.firstChange) {
      this.sequenceno && this.getTransactionById();
    }
  }

  save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }

    const result = this.entryForm.value;

    const newRecord = {
      dailyTransactionEntry: {
        customerCode: result.customer,
        customerName: result.customerName,
        driverLicenseNo: result.licenceNo,
        driverName: result.driverName,
        entryDate: GlobalConstants.commonFunction.getFormattedDate(),
        entryTime: GlobalConstants.commonFunction
          .getFormattedTime()
          .toUpperCase(),
        entryDeliveryInstructions: result.instructions,
        entryKeyPairs: this.keyValueData,
        entryLoginRoleName: this.authenticationService.currentUserValue.role,
        entryLoginUserName:
          this.authenticationService.currentUserValue.userName,
        firstWeight: result.firstWeight,
        goodsType: this.selectedGood,
        nationality: this._getSelectedValue(this.nationalityList,result.nationality,"driverNationalityName", "driverNationalityCode"),
        noOfPieces: result.pieces,
        productCode: this._getSelectedValue(this.productsList,result.products,"productName", "productCode"),
        supplierCode: result.supplier,
        supplierName: result.supplierName,
        transporterCode: this.entryForm.controls['transporter'].value,
        transporterName: this.entryForm.controls['transporterName'].value,
        vehiclePlateNo: result.vehicleNo,
      },
      dailyTransactionExit: {},
      sequenceNo: this.sequenceno || 'new11',
      transactionStatus: 'Entry Completed',
    };

    if (this.sequenceno && this.sequenceno !== '') {
      this.httpService.updateTransaction(newRecord).subscribe({
        next: (res) => {
          console.log(res);
          this.alertService.success(
            `${res.sequenceNo} updated successfully`
          );
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else {
      this.httpService.createNewTransaction(newRecord).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alertService.success(`${res.sequenceNo} inserted successfully`);
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    }
  }

  addKeyValues(event: Event) {
    event.stopPropagation();
    if (this.keyValueData.length === 0) {
      this.emptyKeyValue = false;
      this.keyValueData.push({ name: '', value: '' });
    } else {
      this.emptyKeyValue = this.keyValueData.some((obj: any) => !obj.name);
      if (!this.emptyKeyValue) {
        this.keyValueData.push({ name: '', value: '' });
      }
    }
  }

  public edit(): void {
    // stop here if form is invalid
    if (!findInvalidControls(this.entryForm)) {
      return;
    }
  }

  public cancel(): void {
    this.router.navigate(['/dashboard/transactions'], {
      relativeTo: this.route,
    });
  }

  public trackByFn(index: number, item: any) {
    return item;
  }

  public onChange(event: any) {
    const supplierControl = this.entryForm.get('supplier');
    const customerControl = this.entryForm.get('customer');
    const productsControl = this.entryForm.get('products');

    if (this.selectedGood === 'incoming') {
      this.productsList = this.suppProductsList;
      supplierControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.suppliersList, 'supplierCode')]);
      customerControl?.clearValidators();
      
    } else {
      this.productsList = this.custProductsList;
      customerControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.customersList, 'customerCode')]);
      supplierControl?.clearValidators();
    }

    productsControl?.clearValidators();
    productsControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.productsList, 'productName')]);
    productsControl?.updateValueAndValidity();
    supplierControl?.updateValueAndValidity();
    customerControl?.updateValueAndValidity();   
  }

  onVehicleChange(event: any) {
    const plateNo = this.entryForm.get('vehicleNo')?.value;
    const vehicleData = this.vehicleList.find(
      (v: Vehicle) => v.plateNo === plateNo
    );

    if (vehicleData) {
      this.entryForm.controls['transporter'].setValue(
        vehicleData.transporters.transporterCode
      );
      this.entryForm.controls['firstWeight'].setValue(
        vehicleData.vehicleWeight
      );
      this.entryForm.controls['transporterName'].setValue(
        vehicleData.transporters.nameOfTransporter
      );
    }
  }

  onSupplierChange(event: any) {    
    const supplierData = this.suppliersList.find((s: Supplier) => s.supplierCode === this.entryForm.get('supplier')?.value);
    this.entryForm.controls['supplierName'].setValue("");
    if (supplierData) {
      this.entryForm.controls['supplierName'].setValue(supplierData.supplierName);
    }
  }

  onCustomerChange(event: any) {
    const custData = this.customersList.find((c: Customer) => c.customerCode === this.entryForm.get('customer')?.value);
    this.entryForm.controls['customerName'].setValue("");
    if (custData) {
      this.entryForm.controls['customerName'].setValue(custData.customerName);
    }
  }
  

  public printLayout(): void {
     window.print();     
  }   

  public addNew(event: Event, controlName: string): void {
    event.stopPropagation();

    this._openDialog(controlName);
  }

  private _openDialog(controlName: string): void {
    const dialogData = {
      actionName: 'add',
      headerText: 'Information',
    };

    const dialogConfig = new MatDialogConfig();
    const template: ComponentType<any> =
      controlName === 'vehicleNo'
        ? VehicleDataComponent
        : controlName === 'supplier'
        ? SupplierdataComponent
        : CustomerdataComponent;
    dialogConfig.data = dialogData;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(template, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        controlName === 'vehicleNo'
          ? this.getAllVehicles(result)
          : controlName === 'supplier'
          ? this.getAllSuppliers(result)
          : this.getAllCustomers(result);
      }
    });
  } 

  private populateListData(): void {
    this.goodsList = GlobalConstants.commonFunction.getGoodsOption();
    this.getAllVehicles();
    this.getAllTransporters();
    this.getAllNationalities();
    this.getAllSuppliers();
    this.getAllProducts();
    this.getAllCustomers();
    this.sequenceno && this.getTransactionById();
    this._setAutoCompleteVehicleData();
    this._setAutoCompleteProductData();
    this._setAutoCompleteSupplierData();
    this._setAutoCompleteCustomerData();
    this._setAutoCompleteNationalityData();
  }

  private getAllVehicles(newRecord?: Vehicle): void {
    const vehicleNoControl = this.entryForm.get('vehicleNo');
    this.vehiclesService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicleList = data;
        if (newRecord) {
          vehicleNoControl?.setValue(newRecord?.plateNo);
          this.entryForm.controls['transporter'].setValue(
            newRecord?.transporters.nameOfTransporter
          );
        }
        vehicleNoControl?.clearValidators();
        vehicleNoControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.vehicleList, 'plateNo')]);
        vehicleNoControl?.updateValueAndValidity();
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
    const nationalityControl = this.entryForm.get('nationality');
    this.nationalityService.getAllDriverNationalities().subscribe({
      next: (data: Nationality[]) => {
        this.nationalityList = data;        
        nationalityControl?.clearValidators();
        nationalityControl?.setValue(
          this._getSelectedValue(this.nationalityList,this.transactionData?.dailyTransactionEntry?.nationality,"driverNationalityCode" ,"driverNationalityName" ), 
        );
        nationalityControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.nationalityList, 'driverNationalityName')]);
        nationalityControl?.updateValueAndValidity();
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllSuppliers(newRecord?: Supplier): void {
    const supplierControl = this.entryForm.get('supplier');
    const supplierName = this.entryForm.get('supplierName');
    this.supplierService.getAllSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliersList = data;
        if (newRecord) {
          supplierControl?.setValue(newRecord?.supplierCode);
          supplierName?.setValue(this._getSelectedValue(this.suppliersList,newRecord?.supplierCode,"supplierCode", "supplierName"));
        }
        else{
          supplierName?.setValue(this._getSelectedValue(this.suppliersList,this.transactionData?.dailyTransactionEntry?.supplierCode,"supplierCode", "supplierName"));  
        }                
        supplierControl?.clearValidators();
        if (this.selectedGood === 'incoming') {
        supplierControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.suppliersList, 'supplierCode')]);
        }
        supplierControl?.updateValueAndValidity();
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllProducts() {
    const productsControl = this.entryForm.get('products');

   this.suppProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.suppProductsList = data;        
        if (this.selectedGood === 'incoming') {
          this.productsList = this.suppProductsList;
          productsControl?.setValue(this._getSelectedValue(this.productsList,this.transactionData?.dailyTransactionEntry.productCode,"productCode","productName"));
          productsControl?.clearValidators();
          productsControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.productsList, 'productName')]);
          productsControl?.updateValueAndValidity();
      }       
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });

    this.custProductService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.custProductsList = data;
        if (this.selectedGood !== 'incoming') {
          this.productsList = this.custProductsList;
          productsControl?.setValue(this._getSelectedValue(this.productsList,this.transactionData?.dailyTransactionEntry.productCode,"productCode","productName"));
          productsControl?.clearValidators();
          productsControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.productsList, 'productName')]);
          productsControl?.updateValueAndValidity();
        } 
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });    
  }

  private getAllCustomers(newRecord?: Customer): void {
    const customerControl = this.entryForm.get('customer');
    const customerName = this.entryForm.get('customerName');
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customersList = data;
        if (newRecord) {
          customerControl?.setValue(newRecord?.customerCode);          
        }

        if (newRecord) {
          customerControl?.setValue(newRecord?.customerCode);   
          customerName?.setValue(this._getSelectedValue(this.customersList,newRecord?.customerCode,"customerCode", "customerName"));
        }
        else{
          customerName?.setValue(this._getSelectedValue(this.customersList,this.transactionData?.dailyTransactionEntry?.customerCode,"customerCode", "customerName"));  
        }  
        
        customerControl?.clearValidators();
        if (this.selectedGood !== 'incoming') {
          customerControl?.addValidators([
            Validators.required,
            Validators.maxLength(50),
            autocompleteObjectValidator(this.customersList, 'customerCode'),
          ]);
        }
        customerControl?.updateValueAndValidity();
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getTransactionById(): void {
    if (this.transactionData &&  this.transactionData.dailyTransactionEntry) {

      const data = this.transactionData;

      if (data && data.dailyTransactionEntry) {
        this.entryForm.controls['sequenceNo'].setValue(data.sequenceNo);
        this.entryForm.controls['vehicleNo'].setValue(
          data.dailyTransactionEntry.vehiclePlateNo
        );
        this.entryForm.controls['transporter'].setValue(
          data.dailyTransactionEntry.transporterCode
        );
        this.entryForm.controls['supplier'].setValue(
          data.dailyTransactionEntry.supplierCode
        );
        this.entryForm.controls['customer'].setValue(
          data.dailyTransactionEntry.customerCode
        );       
        this.entryForm.controls['products'].setValue(
          data.dailyTransactionEntry.productCode
        );
        this.entryForm.controls['operator'].setValue(
          data.dailyTransactionEntry.entryLoginUserName
        );
        this.entryForm.controls['role'].setValue(
          data.dailyTransactionEntry.entryLoginRoleName
        );
        this.selectedGood = data.dailyTransactionEntry.goodsType;
        this.keyValueData = data.dailyTransactionEntry.entryKeyPairs;
        this.entryForm.controls['nationality'].setValue(
          data.dailyTransactionEntry?.nationality
        );
        this.entryForm.controls['pieces'].setValue(
          data.dailyTransactionEntry.noOfPieces
        );
        this.entryForm.controls['driverName'].setValue(
          data.dailyTransactionEntry.driverName
        );
        this.entryForm.controls['licenceNo'].setValue(
          data.dailyTransactionEntry.driverLicenseNo
        );
        this.entryForm.controls['firstWeight'].setValue(
          data.dailyTransactionEntry.firstWeight
        );
        this.entryForm.controls['dateIn'].setValue(
          data.dailyTransactionEntry.entryDate
        );
        this.entryForm.controls['timeIn'].setValue(
          data.dailyTransactionEntry.entryTime
        );
        this.entryForm.controls['instructions'].setValue(
          data.dailyTransactionEntry.entryDeliveryInstructions
        );
      }

      this.entryForm.updateValueAndValidity();

      const controls = this.entryForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.entryForm.controls[name].markAllAsTouched();
          this.entryForm.controls[name].markAsDirty();
        }
      }
    }

    

    
  }

  private _setAutoCompleteVehicleData() :void {
    this.filteredVehicleList = this.entryForm.get('vehicleNo')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.vehicleList,item,"plateNo") : this.vehicleList.slice())),
    );   
  }

  private _setAutoCompleteProductData() :void {
    this.filteredProductsList = this.entryForm.get('products')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.productsList,item,"productName") : this.productsList.slice())),
    );   
  }

  private _setAutoCompleteSupplierData() :void {
    this.filteredSupplierList = this.entryForm.get('supplier')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.suppliersList,item,"supplierCode", "supplierName") : this.suppliersList.slice())),
    );   
  }

  private _setAutoCompleteCustomerData() :void {
    this.filteredCustomerList = this.entryForm.get('customer')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.customersList,item,"customerCode","customerName") : this.customersList.slice())),
    );   
  }

  private _setAutoCompleteNationalityData() :void {
    this.filteredNationalityList = this.entryForm.get('nationality')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterData(this.nationalityList,item,"driverNationalityName") : this.nationalityList.slice())),
    );   
  }

  

  private _filterData(list:any, value: string,key :string, nameSearch:string =''): any[] {
    if (value === '') {
      return list.slice();
    }
    
    const filterValue = value?.toLowerCase();
    return list.filter((item :any) => item[key].toLowerCase().includes(filterValue) || nameSearch && item[nameSearch].toLowerCase().includes(filterValue) );
  }

  private _getSelectedValue(list:any, value: string, key :string, returnKey:string): string {
    if (list) {
      const filterValue = value?.toLowerCase();
      const filterList = list.find((item: any) =>
        item[key].toString().toLowerCase().includes(filterValue)
      );
      return (filterList && filterList[returnKey]) ?? '';
    }

    return "";
  }  
}


function autocompleteObjectValidator(listObj: any, keyName: string, ): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if(!control.value) { return null;}
    let index = listObj?.findIndex((obj: any) => obj[keyName] === control.value);
    if (index !== -1) {  return null; }

    return {     
      invalidData: { value: control.value } 
    };
  };
}
