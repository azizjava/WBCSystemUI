
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Products, tableOperation, Vehicle } from '../models';
import { ProductDataComponent } from './productsdata/productdata.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  tblColumns: string[] = ['ProductCode', 'ProductName', 'ProductPrice', 'GroupCode',  'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'ProductCode', dir: 'asc' };
  public visibleColumns = ['ProductCode', 'ProductName', 'Actions'];


  constructor(private translate: TranslateService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getTranslatedText();
    this.getData();
  }



  selectedRecord(actionData: tableOperation): void {
    this.actionName = actionData.action;

    const dialogData = { actionName: this.actionName, headerText: 'Information', data: actionData.data };

    if (this.actionName === 'delete') {
      this.deleteDialog(dialogData);
    }
    else { this.openDialog(dialogData); }

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

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: Products = {
          Id: dialogData.data?.Id, ProductCode: result.productCode, ProductName: result.productName, GroupCode: result.groupCode, ProductPrice: result.productPrice };
        this._updateRecord(selRecord);
      }
      else if (this.actionName === "add") { 
        const selRecord: Products = {
          Id: GlobalConstants.commonFunction.getNewUniqueId(this.tableData), ProductCode: result.productCode, ProductName: result.productName, GroupCode: result.groupCode, ProductPrice: result.productPrice };
        this._addRecord(selRecord); 
      }
    });

  }

  private deleteDialog(dialogData: modelDialog): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.data.message = "Are you sure you want to delete this item ?";
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this._deleteRecord(dialogData.data);
    });

  }

  private _deleteRecord(selRecord: Products) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: Products) {
    console.log('New Record !!', selRecord);
    this.tableData.push(selRecord);  //add the new model object to the dataSource
    this.tableData = [...this.tableData];  //refresh the dataSource
  }

  private _updateRecord(selRecord: Products) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].ProductCode = selRecord.ProductCode;
      this.tableData[selIndex].ProductName = selRecord.ProductName;
      this.tableData[selIndex].GroupCode = selRecord.GroupCode;
      this.tableData[selIndex].productPrice = selRecord.ProductPrice;
    }
  }


  private getTranslatedText(): void {

    this.translate.get(['']).subscribe((translated: string) => {

      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchproduct')
      }

    });
  }


  private getData(): void {

    this.tableData = [
      {
        "Id": "1",
        "ProductCode": "P-01",
        "ProductName": "Product-01",
        "GroupCode": "PG-01",
        "ProductPrice": "1001"
      },
      {
        "Id": "2",
        "ProductCode": "P-02",
        "ProductName": "Product-02",
        "GroupCode": "PG-02",
        "ProductPrice": "1002"
      },
      {
        "Id": "3",
        "ProductCode": "P-03",
        "ProductName": "Product-03",
        "GroupCode": "PG-03",
        "ProductPrice": "1003"
      },
      {
        "Id": "4",
        "ProductCode": "P-04",
        "ProductName": "Product-04",
        "GroupCode": "PG-04",
        "ProductPrice": "1004"
      },

      {
        "Id": "5",
        "ProductCode": "P-05",
        "ProductName": "Product-05",
        "GroupCode": "PG-05",
        "ProductPrice": "1005"
      },
      {
        "Id": "6",
        "ProductCode": "P-06",
        "ProductName": "Product-06",
        "GroupCode": "PG-06",
        "ProductPrice": "1006"
      },
      {
        "Id": "7",
        "ProductCode": "P-07",
        "ProductName": "Product-07",
        "GroupCode": "PG-07",
        "ProductPrice": "1007"
      },
      {
        "Id": "8",
        "ProductCode": "P-08",
        "ProductName": "Product-08",
        "GroupCode": "PG-01",
        "ProductPrice": "1001"
      },
      {
        "Id": "9",
        "ProductCode": "P-09",
        "ProductName": "Product-09",
        "GroupCode": "PG-02",
        "ProductPrice": "1002"
      },
      {
        "Id": "10",
        "ProductCode": "P-02",
        "ProductName": "Product-10",
        "GroupCode": "PG-02",
        "ProductPrice": "1002"
      },
    ]
  }
}
