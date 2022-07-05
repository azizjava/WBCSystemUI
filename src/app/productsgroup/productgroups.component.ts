
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { modelDialog, ProductGroup,  tableOperation } from '../models';
import { ProductGroupDataComponent } from './productgroupdata/productgroupdata.component';


@Component({
  selector: 'app-products',
  templateUrl: './productgroups.component.html',
  styleUrls: ['./productgroups.component.scss']
})
export class ProductGroupsComponent implements OnInit {


  tblColumns: string[] = ['GroupCode', 'GroupName', 'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'GroupCode', dir: 'asc' };
  public visibleColumns = ['GroupCode', 'GroupName', 'Actions'];


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

    const dialogRef = this.matDialog.open(ProductGroupDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: ProductGroup = {
          Id: dialogData.data?.Id, GroupCode: result.groupCode, GroupName: result.groupName };
        this._updateRecord(selRecord);
      }
      else if (this.actionName === "add") { this._addRecord(result); }
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

  private _deleteRecord(selRecord: ProductGroup) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: ProductGroup) {
    console.log('New Record !!', selRecord);
  }

  private _updateRecord(selRecord: ProductGroup) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].GroupCode = selRecord.GroupCode;
      this.tableData[selIndex].GroupName = selRecord.GroupName;
    }
  }


  private getTranslatedText(): void {

    this.translate.get(['']).subscribe((translated: string) => {

      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchvehicles')
      }

    });
  }


  private getData(): void {

    this.tableData = [
      {
        "Id": "1",
        "GroupCode": "PG-01",
        "GroupName": "Product Group-01"
      },
      {
        "Id": "2",
        "GroupCode": "PG-02",
        "GroupName": "Product Group-02"
      },
      {
        "Id": "3",
        "GroupCode": "PG-03",
        "GroupName": "Product Group-03"
      },
      {
        "Id": "4",
        "GroupCode": "PG-04",
        "GroupName": "Product Group-04"
      },

      {
        "Id": "5",
        "GroupCode": "PG-05",
        "GroupName": "Product Group-05"
      },
      {
        "Id": "6",
        "GroupCode": "PG-06",
        "GroupName": "Product Group-06"
      },
      {
        "Id": "7",
        "GroupCode": "PG-07",
        "GroupName": "Product Group-07"
      },
      {
        "Id": "8",
        "GroupCode": "PG-01",
        "GroupName": "Product Group-01"
      },
      {
        "Id": "9",
        "GroupCode": "PG-02",
        "GroupName": "Product Group-02"
      },
      {
        "Id": "10",
        "GroupCode": "PG-02",
        "GroupName": "Product Group-02"
      },
    ]
  }
}
