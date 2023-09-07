import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { Customer, modelDialog, tableOperation } from '../models';
import { AlertService } from '../services';
import { CustomerdataComponent } from './customerdata/customerdata.component';
import { CustomersService } from './Customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  tblColumns: string[] = [
    'customerCode',
    'customerName',
    'contactPerson',
    'mobileNo',
    'telephoneNo',
    'faxNo',
    'address',
    'Actions',
  ];
  tableData: Customer[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'customerName', dir: 'asc' };
  public visibleColumns = ['customerCode', 'customerName', 'Actions'];

  constructor(
    private httpService: CustomersService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
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
      this.getCustomerById(dialogData);
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

    const dialogRef = this.matDialog.open(CustomerdataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.customerCode);
          this.alertService.success(
            `${result.customerCode} updated successfully`
          );
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.customerCode);
          this.alertService.success(
            `${result.customerCode} inserted successfully`
          );
        }

        this.getAllCustomers();
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

  private _deleteRecord(selRecord: Customer) {
    this.httpService.deleteCustomer(selRecord.customerCode).subscribe({
      next: () => {
        console.log('Deleted Record !!', selRecord);
        this.getAllCustomers();
      },
      error: (error) => { 
        console.error(error);
        this.alertService.error(error); 
      }
    });
  }  

  private getAllCustomers(): void {
    this.httpService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.tableData = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getCustomerById(dialogData: any): void {
    this.httpService.getCustomerById(dialogData.data?.customerCode).subscribe({
      next: (data: Customer) => {
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
