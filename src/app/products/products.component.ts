import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Product, ProductGroup, tableOperation, Vehicle } from '../models';
import { AlertService } from '../services';
import { ProductsService } from './products.service';
import { ProductDataComponent } from './productsdata/productdata.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  tblColumns: string[] = [
    'productCode',
    'productName',
    'productPrice',
    'productGroupName',
    'Actions',
  ];
  tableData: any = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'productCode', dir: 'asc' };
  public visibleColumns = ['productCode', 'productName', 'Actions'];

  constructor(
    private matDialog: MatDialog,
    private httpService: ProductsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  selectedRecord(actionData: tableOperation): void {
    this.actionName = actionData.action;

    const dialogData = {
      actionName: this.actionName,
      headerText: 'Information',
      data: actionData.data,
    };

    if (this.actionName === 'delete') {
      this.deleteDialog(dialogData);
    } else if (this.actionName === 'edit') {
      this.getProductById(dialogData);
    } else {
      this.openDialog(dialogData);
    }
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
  }
  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(ProductDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.productCode);
          this.alertService.success(
            `${result.productCode} updated successfully`
          );
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.productCode);
          this.alertService.success(
            `${result.productCode} inserted successfully`
          );
        }

        this.getAllProducts();
      }
    });
  }

  private deleteDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.data.message = 'Are you sure you want to delete this item ?';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this._deleteRecord(dialogData.data);
    });
  }

  private _deleteRecord(selRecord: Product) {
    this.httpService.deleteProduct(selRecord.productCode).subscribe({
      next: () => {
        console.log('Deleted Record !!', selRecord);
        this.getAllProducts();
      },
      error: (e) => console.error(e),
    });
  }  

  private getAllProducts(): void {
    this.httpService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.tableData = data;
        this.tableData.forEach((productData: any) => {         
          productData.productGroupName = productData.productGroup
          .map((pg: ProductGroup) => { return pg.groupName; }).join(',');
        });
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getProductById(dialogData: any): void {
    this.httpService.getProductById(dialogData.data?.productCode).subscribe({
      next: (data: Product) => {
        dialogData.data = data;
        this.openDialog(dialogData);
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
