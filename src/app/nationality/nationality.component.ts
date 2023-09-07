import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Nationality, tableOperation } from '../models';
import { AlertService } from '../services';
import { NationalityService } from './nationality.service';
import { NationalityDataComponent } from './nationalitydata/nationalitydata.component';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss'],
})
export class NationalityComponent implements OnInit {
  tblColumns: string[] = ['driverNationalityName', 'Actions'];
  tableData: Nationality[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'driverNationalityName', dir: 'asc' };
  public visibleColumns = ['driverNationalityName', 'Actions'];

  constructor(
    private httpService: NationalityService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllNationalities();
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
      this.getTransporterById(dialogData);
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

    const dialogRef = this.matDialog.open(
      NationalityDataComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.driverNationalityName);
          this.alertService.success(
            `${result.driverNationalityName} updated successfully`
          );
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.driverNationalityName);
          this.alertService.success(
            `${result.driverNationalityName} inserted successfully`
          );
        }

        this.getAllNationalities();
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

  private _deleteRecord(selRecord: Nationality) {
    this.httpService.deleteNationality(selRecord.driverNationalityName).subscribe({
      next: () => {
        console.log('Deleted Record !!', selRecord.driverNationalityName);
        this.alertService.success(
          `${selRecord.driverNationalityName} deleted successfully`
        );

        this.getAllNationalities();
      },
      error: (error) => { 
        console.error(error);
        this.alertService.error(error); 
      }
    });
  } 

  private getAllNationalities(): void {
    this.httpService.getAllDriverNationalities().subscribe({
      next: (data: Nationality[]) => {
        this.tableData = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getTransporterById(dialogData: any): void {
    this.httpService
      .getNationalityById(dialogData.data?.driverNationalityName)
      .subscribe({
        next: (data: Nationality) => {
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
