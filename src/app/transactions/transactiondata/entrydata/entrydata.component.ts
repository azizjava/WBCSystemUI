import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { CustomerdataComponent } from 'src/app/customer/customerdata/customerdata.component';
import { CustomersService } from 'src/app/customer/Customers.service';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { Customer, DriverInfo, modelDialog, Nationality, Product, Supplier, Transporter, Vehicle } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { ProductsService } from 'src/app/supplierproducts/products.service';
import { SupplierdataComponent } from 'src/app/suppliers/supplierdata/supplierdata.component';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { VehicleDataComponent } from 'src/app/vehicles/vehicledata/vehicledata.component';
import { VehiclesService } from 'src/app/vehicles/vehicles.service';
import { TransactionsService } from '../../transactions.service';
import { DriverDataComponent } from '../../driverdata/driverdata.component';
import { NationalityService } from 'src/app/nationality/nationality.service';

@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entrydata.component.html',
  styleUrls: ['./entrydata.component.scss'],
})
export class entryDataComponent implements OnInit, OnChanges {
  @Input() weight: number = 0;
  @Input() sequenceno: string = '';
  @Input() actionName: string = '';
  @Input() transactionData: any;
  @Input() selectedScaleType: string = '';
  @Output() sequenceNoChange = new EventEmitter();

  @ViewChild('video1') videoElement1: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') videoElement2: ElementRef<HTMLVideoElement>;
  @ViewChild('video3') videoElement3: ElementRef<HTMLVideoElement>;
  @ViewChild('video4') videoElement4: ElementRef<HTMLVideoElement>;

  @ViewChild('snap1') snap1: ElementRef<HTMLImageElement>;
  @ViewChild('snap2') snap2: ElementRef<HTMLImageElement>;
  @ViewChild('snap3') snap3: ElementRef<HTMLImageElement>;
  @ViewChild('snap4') snap4: ElementRef<HTMLImageElement>;

  @Output() hideSnap1: boolean = true;
  @Output() hideSnap2: boolean = true;
  @Output() hideSnap3: boolean = true;
  @Output() hideSnap4: boolean = true;

  video1: HTMLVideoElement;
  video2: HTMLVideoElement;
  video3: HTMLVideoElement;
  video4: HTMLVideoElement;
  canvas: HTMLCanvasElement;

  entryForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  customersList: any = [];
  productsList: any = [];
  goodsList: any = [];
  keyValueData: any = [];
  emptyKeyValue: boolean = false;
  nationalityList: Nationality[] = [];

  filteredVehicleList: Observable<any[]>;
  filteredProductsList: Observable<any[]>;
  filteredSupplierList: Observable<any[]>;
  filteredCustomerList: Observable<any[]>;
  selectedGood: string = '';
  suppProductsList: any = [];
  selDriverInfo!: DriverInfo;
  transporterInfo: any;

  constructor(
    private httpService: TransactionsService,
    private _formBuilder: UntypedFormBuilder,
    private transporterService: TransportersService,
    private vehiclesService: VehiclesService,
    private productService: ProductsService,
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

      supplier: ['', [Validators.required, Validators.maxLength(50)]],
      customer: ['', [Validators.maxLength(50)]],
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
      pieces: ['', [Validators.maxLength(50), patternNumberValidator()]],
      driverData: ['', [Validators.required, Validators.maxLength(50)]],
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

    if (this.actionName === 'view') {
      this.entryForm.disable();
    }

    this.zone.runOutsideAngular(() => {
      if (this.actionName === undefined) {
        setInterval(() => {
          this.entryForm.controls['timeIn'].setValue(
            GlobalConstants.commonFunction.getFormattedTime()
          );
        }, 1000);
      }
    });

    this.entryForm.get('vehicleNo')?.statusChanges.subscribe(v => 
      {
        if(v ==='INVALID'){
          this.entryForm.controls['transporter'].setValue('');
          this.entryForm.controls['firstWeight'].setValue('');
        }
      });    
     
      // Promise.all([        
      //   navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      // ]).then(([stream1]) => {
      //   // Display the video streams on the page             
      //   this.videoElement1.nativeElement.srcObject = stream1;
      //   this.videoElement1.nativeElement.play(); 
      // }).catch(error => console.error('Error getting video streams:', error));  
      
      navigator.mediaDevices.enumerateDevices()
      .then(devices => {        
          let videoDevices = devices.filter(function(device) {
            return device.kind === 'videoinput';
          });
          videoDevices.forEach((device, index) => {
            navigator.mediaDevices.getUserMedia({
              video: { deviceId: device.deviceId }
            })
            .then((stream) => {
              switch (index) {
                case 0:                  
                  this.videoElement1.nativeElement.srcObject = stream;
                  this.videoElement1.nativeElement.play();
                  break;
                case 1:                  
                  this.videoElement2.nativeElement.srcObject = stream;
                  this.videoElement2.nativeElement.play();
                  break;
                case 2:
                  this.videoElement3.nativeElement.srcObject = stream;
                  this.videoElement3.nativeElement.play();
                  break;
                case 3:
                  this.videoElement4.nativeElement.srcObject = stream;
                  this.videoElement4.nativeElement.play();
                  break;              
                default:
                  break;
              }
            })
            .catch(error => { console.error('Error getting video stream:', error); });
          });
        }  
      )
      .catch(error => { console.error('Error getting video stream:', error); });
     
      
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['weight'] && !changes['weight']?.firstChange) {
      this.entryForm.controls['firstWeight'].setValue(changes['weight'].currentValue);
    }

    if (changes['transactionData'] && !changes['transactionData']?.firstChange) {
      this.sequenceno && this.getTransactionById();
    }
  }

  capture(cameraNumber:number)
  {
    let tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 1024;
    tmpCanvas.height = 768;
    let ctx: CanvasRenderingContext2D | null;
    if(!( ctx = tmpCanvas.getContext("2d")))
    {
      throw new Error(`2d context not supported or canvas already initialized`);
    }
    
    switch (cameraNumber) {      
      case 1: 
        ctx.drawImage(this.videoElement1.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);
        this.snap1.nativeElement.src = tmpCanvas.toDataURL();
        this.hideSnap1 = false;
        break;
      case 2:         
        ctx.drawImage(this.videoElement2.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
        this.snap2.nativeElement.src = tmpCanvas.toDataURL();   
        this.hideSnap2 = false;
        break;
      case 3:
        ctx.drawImage(this.videoElement3.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
        this.snap3.nativeElement.src = tmpCanvas.toDataURL();
        this.hideSnap3 = false;
        break;
      case 4:
        ctx.drawImage(this.videoElement4.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
        this.snap4.nativeElement.src = tmpCanvas.toDataURL();
        this.hideSnap4 = false;
        break;
      default:
        break;      
    }  
  }

  clearsnap(cameraNumber:number)
  {
    switch (cameraNumber) {      
      case 1:          
        this.snap1.nativeElement.src = "";
        this.hideSnap1 = true;
        break;
      case 2:   
        this.snap2.nativeElement.src = "";   
        this.hideSnap2 = true;
        break;
      case 3:
        this.snap3.nativeElement.src = "";
        this.hideSnap3 = true;
        break;
      case 4: 
        this.snap4.nativeElement.src = "";
        this.hideSnap4 = true;        
        break;
      default:
        break;      
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
        driverLicenseNo: this.selDriverInfo.licenseNo,
        driverName: this.selDriverInfo.driverName,
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
        nationality: this.selDriverInfo.nationalityId,
        noOfPieces: result.pieces,
        productCode: this._getSelectedValue(this.productsList,result.products,"productName", "productCode"),
        supplierCode: result.supplier,
        transporterCode: this.transporterInfo.code,
        transporterName: this.transporterInfo.name,
        vehiclePlateNo: result.vehicleNo,
      },
      dailyTransactionExit: {},
      sequenceNo: this.sequenceno || 'new11',
      transactionStatus: 'Entry Completed',
    };

    if (this.selectedGood === 'incoming' && newRecord.dailyTransactionEntry.supplierCode ) {
      newRecord.dailyTransactionEntry.supplierCode = newRecord?.dailyTransactionEntry.supplierCode.toString().split('/')[0] ?? "";
    }

    if (this.selectedGood === 'outgoing' && newRecord.dailyTransactionEntry.supplierCode ) {
      newRecord.dailyTransactionEntry.customerCode = newRecord?.dailyTransactionEntry.customerCode.toString().split('/')[0] ?? "";
    }

    if (this.sequenceno && this.sequenceno !== '') {
      this.httpService.updateTransaction(newRecord).subscribe({
        next: (res) => {
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
          this.entryForm.controls['sequenceNo'].setValue(res.sequenceNo);
          this.alertService.success(`${res.sequenceNo} inserted successfully`);
          this.sequenceNoChange.emit(res.sequenceNo);
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
      supplierControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidatorWithString(this.suppliersList, 'supplierCode')]);
      customerControl?.clearValidators();
      
    } else {
      customerControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidatorWithString(this.customersList, 'customerCode')]);
      supplierControl?.clearValidators();
    }

    productsControl?.setValue('');
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
      this.entryForm.controls['firstWeight'].setValue(
        vehicleData.vehicleWeight
      );
      this.transporterInfo = { code : vehicleData.transporters.transporterCode, name : vehicleData.transporters.transporterName};
      this.entryForm.controls['transporter'].setValue( `${this.transporterInfo.code} / ${this.transporterInfo.name}` );
    }
  }

  onSupplierChange(event: any) {    
    const supplierData = this.suppliersList.find((s: Supplier) => s.supplierCode === this.entryForm.get('supplier')?.value);
   
  }

  onCustomerChange(event: any) {
    const custData = this.customersList.find((c: Customer) => c.customerCode === this.entryForm.get('customer')?.value);   
  }
  

  public printLayout(): void {
     window.print();     
  }   

  public addNew(event: Event, controlName: string): void {
    event.stopPropagation();

    this._openDialog(controlName);
  }

  private _openDialog(controlName: string): void {
    const dialogData:any = {
      actionName: 'add',
      headerText: 'Information',
    };
    if(controlName === 'driverInfo'){
      dialogData.data = {
        nationality :'',
        nationalityId :this.selDriverInfo?.nationalityId,
        licenseNo: this.selDriverInfo?.licenseNo,
        driverName: this.selDriverInfo?.driverName,
        nationalityList: this.nationalityList
      };
    }

    const dialogConfig = new MatDialogConfig();
    const template: ComponentType<any> =
      controlName === 'vehicleNo'
        ? VehicleDataComponent
        : controlName === 'supplier'
        ? SupplierdataComponent
        : controlName === 'driverInfo'
        ? DriverDataComponent
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
          : controlName === 'driverInfo'
          ? this.bindDriverInfo(result)
          : this.getAllCustomers(result);
      }
    });
  } 

  private bindDriverInfo(result :DriverInfo) :void {
    this.selDriverInfo = { 
      driverName :result.driverName,
      licenseNo:result.licenseNo,
      nationality :result.nationality,
      nationalityId :result.nationalityId,
    }

    this.entryForm.controls['driverData'].setValue(
      `${this.selDriverInfo.licenseNo} / ${ this.selDriverInfo.driverName } / ${ this.selDriverInfo.nationality }`
    );
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
  }

  private getAllNationalities(): void {
    const nationalityControl = this.entryForm.get('nationality');
    this.nationalityService.getAllDriverNationalities().subscribe({
      next: (data: Nationality[]) => {
        this.nationalityList = data;
        if(this.selDriverInfo){
          this.selDriverInfo.nationality = this._getSelectedValue(this.nationalityList,this.selDriverInfo?.nationalityId, "driverNationalityCode" ,"driverNationalityName");
          this.entryForm.controls['driverData'].setValue(`${this.selDriverInfo.licenseNo} / ${ this.selDriverInfo.driverName } / ${ this.selDriverInfo.nationality }`  );
        }        
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getAllVehicles(newRecord?: Vehicle): void {
    const vehicleNoControl = this.entryForm.get('vehicleNo');
    this.vehiclesService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicleList = data;
        if (newRecord) {
          vehicleNoControl?.setValue(newRecord?.plateNo);
          this.transporterInfo = { code : newRecord?.transporters.transporterCode, name : newRecord?.transporters.transporterName};
          this.entryForm.controls['transporter'].setValue(`${this.transporterInfo.code} \ ${this.transporterInfo.name}`);
        }
        else{
          this.onVehicleChange(null);
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

  private getAllSuppliers(newRecord?: Supplier): void {
    const supplierControl = this.entryForm.get('supplier');
    this.supplierService.getlistAllSupplierCodeAndName().subscribe({
      next: (data: any) => {
        this.suppliersList = data;
        if (newRecord) {
          supplierControl?.setValue(`${newRecord?.supplierCode}/${newRecord.supplierName}`);
        }                       
        supplierControl?.clearValidators();
        if (this.selectedGood === 'incoming') {
          if (this.entryForm.controls['sequenceNo'].value !== 0) {
            const supplierCode = this.entryForm.get('supplier')?.value;
            const supplierData = this.suppliersList.find((s:string) => s.includes(supplierCode +'/'));

            if (supplierData) {
              supplierControl?.setValue(`${supplierData}`);              
            }
          }
        supplierControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidatorWithString(this.suppliersList, 'supplierCode')]);
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

   this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.suppProductsList = data;        
        this.productsList = this.suppProductsList;
        productsControl?.setValue(this._getSelectedValue(this.productsList,this.transactionData?.dailyTransactionEntry.productCode,"productCode","productName"));
        productsControl?.clearValidators();
        productsControl?.addValidators([Validators.required, Validators.maxLength(50), autocompleteObjectValidator(this.productsList, 'productName')]);
        productsControl?.updateValueAndValidity();
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });

     
  }

  private getAllCustomers(newRecord?: Customer): void {
    const customerControl = this.entryForm.get('customer');
    this.customerService.getAllAllCustomerCodeAndName().subscribe({
      next: (data: any) => {
        this.customersList = data;
        if (newRecord) {
          customerControl?.setValue(`${newRecord?.customerCode}/${newRecord.customerName}`); 
        } 
         
        customerControl?.clearValidators();
        if (this.selectedGood !== 'incoming') {

          if (this.entryForm.controls['sequenceNo'].value !== 0) {
            const customerCode = this.entryForm.get('customer')?.value;
            const customerData = this.customersList.find((s:string) => s.includes(customerCode +'/'));

            if (customerData) {
              customerControl?.setValue(`${customerData}`);   
            }
          }
          customerControl?.addValidators([
            Validators.required,
            Validators.maxLength(50),
            autocompleteObjectValidatorWithString(this.customersList, 'customerCode'),
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
        this.entryForm.controls['pieces'].setValue(
          data.dailyTransactionEntry.noOfPieces
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
     
        this.selDriverInfo = { 
          driverName :data.dailyTransactionEntry.driverName,
          licenseNo:data.dailyTransactionEntry.driverLicenseNo,
          nationality :'',
          nationalityId :data.dailyTransactionEntry?.nationality
        }
        this.transporterInfo = { code : data.dailyTransactionEntry.transporterCode, name : ''};

        this.entryForm.controls['driverData'].setValue(`${this.selDriverInfo.licenseNo} / ${ this.selDriverInfo.driverName }`  );
        this.entryForm.controls['transporter'].setValue( `${this.transporterInfo.code} / ${this.transporterInfo.name}` );

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
      map((item :any)=> (item ? this._filterDataFromString(this.suppliersList,item,"supplierCode", "supplierName") : this.suppliersList.slice())),
    );   
  }

  private _setAutoCompleteCustomerData() :void {
    this.filteredCustomerList = this.entryForm.get('customer')!.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? value : undefined)),
      map((item :any)=> (item ? this._filterDataFromString(this.customersList,item,"customerCode","customerName") : this.customersList.slice())),
    );   
  }


  private _filterDataFromString(list:any, value: string,key :string, nameSearch:string =''): any[] {
    if (value === '') {
      return list.slice();
    }
    
    const filterValue = value?.toLowerCase();
    return list.filter((item :any) => item.toLowerCase().includes(filterValue) || nameSearch && item.toLowerCase().includes(filterValue) );
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

  private _getSelectedValueFromString(list:any, value: string, key :string, returnKey:string): string {
    if (list) {
      const filterValue = value?.toLowerCase();
      const filterList = list.find((item: any) =>
        item.toString().toLowerCase().includes(filterValue)
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

function autocompleteObjectValidatorWithString(listObj: any, keyName: string, ): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if(!control.value) { return null;}
    let index = listObj?.findIndex((obj: any) => obj  === control.value);
    if (index !== -1) {  return null; }

    return {     
      invalidData: { value: control.value } 
    };
  };
}

