
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Operator,  tableOperation } from '../models';
import { OperatorDataComponent } from './operatordata/operatordata.component';


@Component({
  selector: 'app-products',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {


  tblColumns: string[] = ['OperatorId', 'OperatorName', 'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'OperatorId', dir: 'asc' };
  public visibleColumns = ['OperatorId', 'OperatorName', 'Actions'];


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

    const dialogRef = this.matDialog.open(OperatorDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: Operator = {
          Id: dialogData.data?.Id, OperatorId: result.operatorId, OperatorName: result.operatorName };
        this._updateRecord(selRecord);
      }
      else if (this.actionName === "add") { 
        const selRecord: Operator = {
          Id: GlobalConstants.commonFunction.getNewUniqueId(this.tableData), OperatorId: result.operatorId, OperatorName: result.operatorName };
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

  private _deleteRecord(selRecord: Operator) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: Operator) {
    console.log('New Record !!', selRecord);
    this.tableData.push(selRecord);  //add the new model object to the dataSource
    this.tableData = [...this.tableData];  //refresh the dataSource
  }

  private _updateRecord(selRecord: Operator) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].OperatorId = selRecord.OperatorId;
      this.tableData[selIndex].OperatorName = selRecord.OperatorName;
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
        "OperatorId": "OP-01",
        "OperatorName": "Operator-01"
      },
      {
        "Id": "2",
        "OperatorId": "OP-02",
        "OperatorName": "Operator-02"
      },
      {
        "Id": "3",
        "OperatorId": "OP-03",
        "OperatorName": "Operator-03"
      },
      {
        "Id": "4",
        "OperatorId": "OP-04",
        "OperatorName": "Operator-04"
      },

      {
        "Id": "5",
        "OperatorId": "OP-05",
        "OperatorName": "Operator-05"
      },
     
    ]
  }
}
