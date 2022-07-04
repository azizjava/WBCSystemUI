
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { modelDialog, tableOperation, Vehicle } from '../models';
import { AuthenticationService } from '../services';

import { VehiclesDataComponent } from './vehiclesdata/vehiclesdata.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {


  tblColumns: string[] = ['PlateNo', 'Type', 'TransporterCode', 'TransporterName', 'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'PlateNo', dir: 'asc' };
  public visibleColumns = ['PlateNo', 'Type', 'Actions'];


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

    const dialogRef = this.matDialog.open(VehiclesDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: Vehicle = {
          Id: dialogData.data?.Id, PlateNo: result.plateNo, Type: result.type, TransporterCode: result.transporterCode, TransporterName: result.transporterName };
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

  private _deleteRecord(selRecord: Vehicle) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: Vehicle) {
    console.log('New Record !!', selRecord);
  }

  private _updateRecord(selRecord: Vehicle) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].PlateNo = selRecord.PlateNo;
      this.tableData[selIndex].Type = selRecord.Type;
      this.tableData[selIndex].TransporterCode = selRecord.TransporterCode;
      this.tableData[selIndex].TransporterName = selRecord.TransporterName;
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
        "PlateNo": "V-01",
        "Type": "Vehicle-01",
        "TransporterCode": "T-01",
        "TransporterName": "Transporter-01"
      },
      {
        "Id": "2",
        "PlateNo": "V-02",
        "Type": "Vehicle-02",
        "TransporterCode": "T-02",
        "TransporterName": "Transporter-02"
      },
      {
        "Id": "3",
        "PlateNo": "V-03",
        "Type": "Vehicle-03",
        "TransporterCode": "T-03",
        "TransporterName": "Transporter-03"
      },
      {
        "Id": "4",
        "PlateNo": "V-04",
        "Type": "Vehicle-04",
        "TransporterCode": "T-04",
        "TransporterName": "Transporter-04"
      },

      {
        "Id": "5",
        "PlateNo": "V-05",
        "Type": "Vehicle-05",
        "TransporterCode": "T-05",
        "TransporterName": "Transporter-05"
      },
      {
        "Id": "6",
        "PlateNo": "V-06",
        "Type": "Vehicle-06",
        "TransporterCode": "T-06",
        "TransporterName": "Transporter-06"
      },
      {
        "Id": "7",
        "PlateNo": "V-07",
        "Type": "Vehicle-07",
        "TransporterCode": "T-07",
        "TransporterName": "Transporter-07"
      },
      {
        "Id": "8",
        "PlateNo": "V-08",
        "Type": "Vehicle-08",
        "TransporterCode": "T-01",
        "TransporterName": "Transporter-01"
      },
      {
        "Id": "9",
        "PlateNo": "V-09",
        "Type": "Vehicle-09",
        "TransporterCode": "T-02",
        "TransporterName": "Transporter-02"
      },
      {
        "Id": "10",
        "PlateNo": "V-10",
        "Type": "Vehicle-10",
        "TransporterCode": "T-03",
        "TransporterName": "Transporter-03"
      },
    ]
  }
}
