import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { modelDialog, tableOperation, Vehicle } from '../models';
import { AlertService } from '../services';

import { VehicleDataComponent } from './vehicledata/vehicledata.component';
import { VehiclesService } from './vehicles.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  tblColumns: string[] = [
    'plateNo',
    'vehicleType',
    'vehicleWeight',
    'transporterCode',
    'transporterName',
    'Actions',
  ];
  public tableData: any;
  public vehiclesData: Vehicle[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'plateNo', dir: 'asc' };
  public visibleColumns = ['plateNo', 'vehicleType', 'Actions'];

  constructor(
    private matDialog: MatDialog,
    private httpService: VehiclesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
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
      this.getVehicleById(dialogData);
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

    const dialogRef = this.matDialog.open(VehicleDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.plateNo);
          this.alertService.success(`${result.plateNo} updated successfully`);
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.plateNo);
          this.alertService.success(`${result.plateNo} inserted successfully`);
        }

        this.getAllVehicles();
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

  private _deleteRecord(selRecord: Vehicle) {
    this.httpService.deleteVehicle(selRecord.plateNo).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord);
        this.getAllVehicles();
      },
      error: (e) => {
        console.error(e)
      },
    });
  }  

  private getAllVehicles(): void {
    this.httpService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehiclesData = data;

        this.tableData = data.map((data: Vehicle) => ({
          plateNo: data.plateNo,
          vehicleType: data.vehicleType,
          vehicleWeight: data.vehicleWeight,
          transporterCode: data?.transporters?.transporterCode,
          transporterName: data?.transporters?.transporterName,
        }));
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getVehicleById(dialogData: any): void {
    this.httpService.getVehicleById(dialogData.data?.plateNo).subscribe({
      next: (data: Vehicle) => {        
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
