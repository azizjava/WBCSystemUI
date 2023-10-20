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
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { modelDialog, Product} from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { ProductsService } from '../products.service';
import { UserRole } from 'src/app/common';

@Component({
  selector: 'app-productdata',
  templateUrl: './productdata.component.html',
  styleUrls: ['./productdata.component.scss'],
})
export class ProductDataComponent implements OnInit, AfterViewChecked {
  public form: UntypedFormGroup;
  public productData!: Product;
  public productGroupsList: any = [];
  public dropdownSettings: any = {};
  public staticText: any = {};
  private _hasChange: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ProductDataComponent>,
    private alertService: AlertService,
    private httpService: ProductsService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog,
    private authenticationService: AuthenticationService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      productCode: ['', [Validators.required, Validators.maxLength(30)]],
      productName: ['', [Validators.required, Validators.maxLength(30)]],
      customerPrice: [0, [Validators.required, Validators.maxLength(30), patternNumberValidator()]],
      productStock: [0, [Validators.required, Validators.maxLength(30), patternNumberValidator()]],
      supplierPrice: [0, [Validators.required, Validators.maxLength(30), patternNumberValidator()]],
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
      this.productData = this.data.data;
      this.form.controls['productCode'].setValue(this.productData?.productCode);
      this.form.controls['productName'].setValue(this.productData?.productName);
      this.form.controls['customerPrice'].setValue(this.productData?.customerPrice.toString());
      this.form.controls['productStock'].setValue(this.productData?.productStock.toString());
      this.form.controls['supplierPrice'].setValue(this.productData?.supplierPrice.toString());

      if (this.data.actionName === 'view') {
        this.form.disable();
      }
    }

    if(this.authenticationService.currentUserValue?.role === UserRole.OPERATOR){
      this.form.controls['customerPrice'].disable();
      this.form.controls['supplierPrice'].disable();
    }

    this._getTranslatedText();
    this._onFormValueChange();
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
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

  public close() {
    this.dialogRef.close();
  }

  public save() {
    // stop here if form is invalid
    if (!findInvalidControls(this.form)) {
      return;
    }

    const result = this.form.value;

    const newRecord: Product = {
      productCode: result.productCode,
      productName: result.productName,
      customerPrice: result.customerPrice === undefined ? 0 : result.customerPrice,
      productStock: result.productStock,
      supplierPrice: result.supplierPrice === undefined ? 0 : result.supplierPrice,
    };

    if (this.data.actionName === 'add') {
      this.httpService.createNewProduct(newRecord).subscribe({
        next: (res: any) => {
          this.dialogRef.close(res);
        },
        error: (error: string) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    } else if (this.data.actionName === 'edit') {
      if (this._hasChange) {
        newRecord.productCode = this.productData?.productCode;
        this.httpService
          .updateProduct(newRecord)
          .subscribe({
            next: (res) => {
              this.dialogRef.close(res);
            },
            error: (error) => {
              console.log(error);
              this.alertService.error(error);
            },
          });
      } else {
        this.dialogRef.close();
      }
    }
  }


  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        productcode: this.translate.instant('products.tbl_header.productcode'),
        productname: this.translate.instant('products.tbl_header.productname'),
        customerprice: this.translate.instant('products.tbl_header.customerprice'),
        supplierprice: this.translate.instant('products.tbl_header.supplierprice'),
        productstock: this.translate.instant('products.tbl_header.productstock'),
        required: this.translate.instant('common.required'),
        save: this.translate.instant('actions.save'),
        cancel: this.translate.instant('actions.cancel'),        
      };
      this.dropdownSettings.text = this.translate.instant('products.tbl_header.selectgroup');
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

 
}
