import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { dateRange, modelDialog, tableOperation, Transporter, Vehicle, WeighBridge } from '../models';
import { AlertService } from '../services';
import { AddWeighbridgesettingComponent } from './weighbridgedata/addweighbridgesetting.component';
import { WeighbridgesettingComponent } from './weighbridgesetting.component';
import { WeightBridgeService } from './weightbridge.service';

@Component({
  selector: 'app-weightbridgelist',
  templateUrl: './weightbridgelist.component.html',
  styleUrls: ['./weightbridgelist.component.scss'],
})
export class WeightbridgeListComponent implements OnInit {
  tblColumns: string[] = [
    'name',
    'deviceStatus',
    'portNo',
    'baudRate',
    'dataBits',
    'Actions',
  ];
  public tableData: any;
  public devicesData: WeighBridge[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'name', dir: 'asc' };
  public visibleColumns = ['name', 'deviceStatus', 'Actions'];

  constructor(
    private matDialog: MatDialog,
    private httpService: WeightBridgeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllDevices();
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
      this.getDeviceById(dialogData);
    }
    else {
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

    const dialogRef = this.matDialog.open(AddWeighbridgesettingComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (this.actionName === 'edit') {
        console.log('Updated Record !!', result.plateNo);
        this.alertService.success(`${result.plateNo} updated successfully`);
      } else if (this.actionName === 'add') {
        console.log('New Record !!', result.plateNo);
        this.alertService.success(`${result.plateNo} inserted successfully`);
      }

      this.getAllDevices();
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

  private _deleteRecord(selRecord: WeighBridge) {
    this.httpService.deleteDevice(selRecord.name).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord);
        this.getAllDevices();
      },
      error: (e) => {
        console.error(e)
      },
    });
  }  

  private getAllDevices(): void {
    this.httpService.getAllDeviceInfo().subscribe({
      next: (data: WeighBridge[]) => {
        this.devicesData = data;
        this.tableData = data;
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getDeviceById(dialogData: any): void {
    this.httpService.getDeviceById(dialogData.data?.name).subscribe({
      next: (data: WeighBridge) => {        
        dialogData.data = data;
        this.openDialog(dialogData);
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
