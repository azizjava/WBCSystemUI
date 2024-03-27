import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { dateRange, modelDialog, tableOperation, transactionFilter, Vehicle } from '../models';
import { AlertService } from '../services';

import { VehicleDataComponent } from './vehicledata/vehicledata.component';
import { VehiclesService } from './vehicles.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent  {
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
  public dateRange: transactionFilter | null;
  public totalItems :number = 0;
  public plateNo : string ="";

  private _pageSize :number = 10;
  private _currentPage :number = 0;

  constructor(
    private matDialog: MatDialog,
    private httpService: VehiclesService,
    private alertService: AlertService
  ) {}

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
      error: (error) => { 
        console.error(error);
        this.alertService.error(error); 
      },
    });
  }

  public dateSelectionChangedEvent(dataRage: transactionFilter){
    this.dateRange = dataRage;
    localStorage.setItem('selDateRange', JSON.stringify(this.dateRange));
    this.plateNo =dataRage.sequenceNo;    
    this._currentPage = 0;
    this.getAllVehicles();
  }

  onsequenceNoChange(plateNo: string) :void {
    this.plateNo = plateNo;
    this._currentPage = 0;
    this.getAllVehicles();
  }

  public onPageOptionChange(pageOption: any) :void {
    this._pageSize = pageOption.pageSize;
    this._currentPage = pageOption.pageIndex;
    this.getAllVehicles();
  }

  public onSortOptionChange(sortOption: Sort) :void {
    if(sortOption.active !== this.sortColumn.name && sortOption.direction !== this.sortColumn.dir){
    this.getAllVehicles();
    }
  }

  private getAllVehicles(): void {
    let searchFilter:any = {
      startDate: this.dateRange?.startDate,
      endDate:  this.dateRange?.endDate,
      pageNo: this._currentPage,
      pageSize:this._pageSize,
      sortOrder: this.sortColumn.dir,
      sortBy:this.sortColumn.name
     };

     if(this.plateNo){
      searchFilter.plateNo = this.plateNo;
    }

    this.httpService.getAllPaginatedVehicles(searchFilter).subscribe({
      next: (data: any) => {
        this.vehiclesData = data;
        this.totalItems= data["total-items"]; 

        this.tableData = data?.listAllVehicle?.map((response: any) => ({
          plateNo: response[0],
          vehicleType: response[1],
          vehicleWeight: response[2],
          transporterCode: response[3],
          transporterName: response[4],
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
