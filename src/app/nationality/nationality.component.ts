import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Nationality,  tableOperation } from '../models';
import { NationalityDataComponent } from './nationalitydata/nationalitydata.component';



@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss']
})
export class NationalityComponent implements OnInit {


  tblColumns: string[] = ['Nationality',  'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'Nationality', dir: 'asc' };
  public visibleColumns = ['Nationality',  'Actions'];


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

    const dialogRef = this.matDialog.open(NationalityDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: Nationality = { Id: dialogData.data?.Id, Nationality: result?.nationality };
        this._updateRecord(selRecord);
      }
      else if (this.actionName === "add") {
        const selRecord: Nationality = { Id: GlobalConstants.commonFunction.getNewUniqueId(this.tableData), Nationality: result?.nationality };
        this._addRecord(selRecord); }
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

  private _deleteRecord(selRecord: Nationality) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: Nationality) {
   console.log('New Record !!', selRecord);
   this.tableData.push(selRecord);  //add the new model object to the dataSource
   this.tableData = [...this.tableData];  //refresh the dataSource
  }

  private _updateRecord(selRecord: Nationality) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].Nationality = selRecord.Nationality;
    }
  }


  private getTranslatedText(): void {

    this.translate.get(['']).subscribe((translated: string) => {

      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchnationality')
      }

    });
  }


  private getData(): void {

    this.tableData = [
      {
        "Id": "1",
        "Nationality": "Indian"
      },
      {
        "Id": "2",
        "Nationality": "Pakistani"
      },
      {
        "Id": "3",
        "Nationality": "Saudi"
      },
      {
        "Id": "4",
        "Nationality": "Syrian"
      },

      {
        "Id": "5",
        "Nationality": "Turk"
      },
     
    ]
  }
}
