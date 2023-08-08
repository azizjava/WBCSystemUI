import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Supplier, tableOperation } from '../models';
import { AlertService } from '../services';
import { SupplierdataComponent } from './supplierdata/supplierdata.component';
import { SuppliersService } from './suppliers.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
  tblColumns: string[] = [
    'supplierCode',
    'supplierName',
    'contactPerson',
    'mobileNo',
    'telephoneNo',
    'faxNo',
    'address',
    'Actions',
  ];
  tableData: Supplier[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'supplierName', dir: 'asc' };
  public visibleColumns = ['supplierCode', 'supplierName', 'Actions'];

  constructor(
    private httpService: SuppliersService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllSuppliers();
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

    const dialogRef = this.matDialog.open(SupplierdataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.supplierCode);
          this.alertService.success(
            `${result.supplierCode} updated successfully`
          );
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.supplierCode);
          this.alertService.success(
            `${result.supplierCode} inserted successfully`
          );
        }

        this.getAllSuppliers();
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

  private _deleteRecord(selRecord: Supplier) {
    this.httpService.deleteSupplier(selRecord.supplierCode).subscribe({
      next: () => {
        console.log('Deleted Record !!', selRecord);
        this.getAllSuppliers();
      },
      error: (e) => console.error(e),
    });
  }  

  private getAllSuppliers(): void {
    this.httpService.getAllSuppliers().subscribe({
      next: (data: Supplier[]) => {
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
      .getSupplierById(dialogData.data?.supplierCode)
      .subscribe({
        next: (data: Supplier) => {
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
