import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from 'src/app/common';
import { CustomerdataComponent } from 'src/app/customer/customerdata/customerdata.component';
import { CustomersService } from 'src/app/customer/Customers.service';
import { findInvalidControls } from 'src/app/helper';
import { Customer, modelDialog, Nationality, Product, Supplier, Transporter, Vehicle } from 'src/app/models';
import { NationalityService } from 'src/app/nationality/nationality.service';
import { ProductsService } from 'src/app/products/products.service';
import { AlertService, AuthenticationService } from 'src/app/services';
import { SupplierdataComponent } from 'src/app/suppliers/supplierdata/supplierdata.component';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';
import { TransportersService } from 'src/app/transporters/transporters.service';
import { VehicleDataComponent } from 'src/app/vehicles/vehicledata/vehicledata.component';
import { VehiclesService } from 'src/app/vehicles/vehicles.service';

@Component({
  selector: 'app-transactionentrydata',
  templateUrl: './entrydata.component.html',
  styleUrls: ['./entrydata.component.scss'],
})
export class entryDataComponent implements OnInit, OnChanges {
  @Input() weight: number = 0;

  public staticText: any = {};

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

  selectedGood: string = '';

  constructor(
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
    private translate: TranslateService,
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
      sequenceNo: [0, [Validators.required, Validators.maxLength(50)]],
      vehicleNo: ['', [Validators.required, Validators.maxLength(50)]],
      transporter: [{ value: this.authenticationService.currentUserValue.userName,
        disabled: true,
      }, [Validators.required, Validators.maxLength(50)]],
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
      nationality: ['', [Validators.required, Validators.maxLength(50)]],
      pieces: ['', [Validators.maxLength(50)]],
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
    this.keyValueData.push({ key: '', value: '' });
    this.getTranslatedText();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['weight']?.firstChange) {
      this.entryForm.controls['firstWeight'].setValue(
        changes['weight'].currentValue
      );
    }
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

  addKeyValues(event: Event) {
    event.stopPropagation(); 
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

    if (this.selectedGood === 'incoming') {
      supplierControl?.setValidators([Validators.required]);
      customerControl?.setValidators(null);
    } else {
      customerControl?.setValidators([Validators.required]);
      supplierControl?.setValidators(null);
    }
  }

  onVehicleChange(event: any) {
    const plateNo = this.entryForm.get('vehicleNo')?.value;
    const transporterData = this.vehicleList.find((v:Vehicle) => v.plateNo === plateNo)?.transporters ;

    if(transporterData){
      this.entryForm.controls['transporter'].setValue(transporterData.nameOfTransporter);
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
  }

  private getAllVehicles(newRecord? : Vehicle ): void {
    this.vehiclesService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicleList = data;
        if(newRecord){
          this.entryForm.controls['vehicleNo'].setValue(newRecord?.plateNo);
          this.entryForm.controls['transporter'].setValue(newRecord?.transporters.nameOfTransporter);
        }
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
    const template: ComponentType<any> = controlName === 'vehicleNo' ? VehicleDataComponent :( controlName === 'supplier' ? SupplierdataComponent : CustomerdataComponent);
    dialogConfig.data = dialogData;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(template, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        controlName === 'vehicleNo' ?  this.getAllVehicles(result) :( controlName === 'supplier' ? this.getAllSuppliers() : this.getAllCustomers());
      }

    });
  }

  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),
        print: this.translate.instant('actions.print'),
        add: this.translate.instant('actions.add'),
        required: this.translate.instant('common.required'),
        operator: this.translate.instant('transactions.data.entry.operator'),
        role: this.translate.instant('transactions.data.entry.role'),
        datein: this.translate.instant('transactions.data.entry.datein'),
        timein: this.translate.instant('transactions.data.entry.timein'),
        sequenceno: this.translate.instant('transactions.data.entry.sequenceno'),
        firstweight: this.translate.instant('transactions.data.entry.firstweight'),
        vehicleno: this.translate.instant('transactions.data.entry.vehicleno'),
        addvehicle: this.translate.instant('transactions.data.entry.addvehicle'),
        transporter: this.translate.instant('transactions.data.entry.transporter'),
        supplier: this.translate.instant('transactions.data.entry.supplier'),
        addsupplier: this.translate.instant('transactions.data.entry.addsupplier'),
        customer: this.translate.instant('transactions.data.entry.customer'),
        addcustomer: this.translate.instant('transactions.data.entry.addcustomer'),
        product: this.translate.instant('transactions.data.entry.product'),
        licenceno: this.translate.instant('transactions.data.entry.licenceno'),
        drivername: this.translate.instant('transactions.data.entry.drivername'),
        nationality: this.translate.instant('transactions.data.entry.nationality'),
        pieces: this.translate.instant('transactions.data.entry.pieces'),
        key: this.translate.instant('transactions.data.entry.key'),
        value: this.translate.instant('transactions.data.entry.value'),
        addkeyvalues: this.translate.instant('transactions.data.entry.addkeyvalues'),
        emptykeyvalue: this.translate.instant('transactions.data.entry.emptykeyvalue'),
        instructions: this.translate.instant('transactions.data.entry.instructions'),      
      };
    });
  }
}
