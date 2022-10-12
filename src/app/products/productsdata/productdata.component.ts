import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Products, ProductGroup } from 'src/app/models';
import { ProductGroupsService } from 'src/app/productsgroup/productgroups.service';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'app-productdata',
  templateUrl: './productdata.component.html',
  styleUrls: ['./productdata.component.scss'],
})
export class ProductDataComponent implements OnInit, AfterViewChecked {
  form: UntypedFormGroup;
  vehicleUser!: Products;
  productGroupsList: any = [];
  dropdownSettings: any = {};
  selectedItems = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ProductDataComponent>,
    private pgService: ProductGroupsService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog,
    private changeDetector: ChangeDetectorRef
  ) {
    this._getTransPortersList();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      productCode: ['', [Validators.required, Validators.maxLength(30)]],
      productName: ['', [Validators.required, Validators.maxLength(30)]],
      productPrice: ['', [Validators.required, Validators.maxLength(30)]],
      groupCode: ['', [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Product group',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      primaryKey: 'groupCode',
      labelKey: 'groupName',
      enableSearchFilter: true,
      noDataLabel: 'Search Product group...',
      classes: 'myclass custom-class',
    };

    if (this.data.actionName !== 'add') {
      this.vehicleUser = this.data.data;
      this.form.controls['productCode'].setValue(this.vehicleUser?.ProductCode);
      this.form.controls['productName'].setValue(this.vehicleUser?.ProductName);
      this.form.controls['productPrice'].setValue(
        this.vehicleUser?.ProductPrice
      );
      this.form.controls['groupCode'].setValue(this.vehicleUser?.GroupCode);

      if (this.data.actionName === 'view') {
        this.form.disable();
      }
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  public OnSelectionChange(event: any) {
    const name =
      this.productGroupsList.filter((s: any) => s.groupCode === event.value)[0]
        ?.groupName || '';
    this.form.controls['groupName'].setValue(name);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }

  private _getTransPortersList(): any {
    this.pgService.getAllProductGroups().subscribe({
      next: (data: any) => {
        this.productGroupsList = data;
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
