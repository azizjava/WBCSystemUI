import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { dateRange, modelDialog, tableOperation, Transporter } from '../models';
import { AlertService } from '../services';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transporters',
  templateUrl: './transactionlist.component.html',
  styleUrls: ['./transactionlist.component.scss'],
})
export class TransactionsListComponent {
  tblColumns: string[] = [ 'Actions','sequenceNo', 'transactionStatus', 'entryDateAndTime', 'entryLoginUserName',  'vehiclePlateNo','customerInfo', 'productCode'];
  tableData: any = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'entryDateAndTime', dir: 'desc' };
  public visibleColumns = [ 'Actions','sequenceNo', 'transactionStatus'];
  public dateRange: dateRange | null;
  public sequenceNo : string ="";

  constructor(
    private matDialog: MatDialog,
    private httpService: TransactionsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
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
    } else if (this.actionName === 'edit' || this.actionName === 'view') {
      this.router.navigate(['/dashboard/transactions/add'], { queryParams: { sequenceno: dialogData.data?.sequenceNo, action: this.actionName } });
    } else {
      this.router.navigate(['/dashboard/transactions/add'],  {relativeTo: this.route});
    }     
   
  }

  public dateSelectionChangedEvent(dataRage: dateRange){
    this.dateRange = dataRage;
    this.getAllTransactions();
  }

  onsequenceNoChange(sequenceNo: string) :void {
    this.sequenceNo = sequenceNo;
    this.getAllTransactions();
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
    this.dateRange = null;
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

  private _deleteRecord(selRecord: any) {
    this.httpService.deleteTransaction(selRecord.sequenceNo).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord);
        this.getAllTransactions();
      },
      error: (e) => {
        console.error(e)
      },
    });
  }  

  private getAllTransactions(): void {
    let searchFilter:any = {
     startDate: this.sequenceNo ? "" : this.dateRange?.startDate,
     endDate: this.sequenceNo ? "": this.dateRange?.endDate,
     pageNo: '0',
     pageSize:20,
    // sortBy:this.sortColumn.name
    };

    if(this.sequenceNo){
      searchFilter.sequenceNo = this.sequenceNo;
    }
    this.httpService.getAllTransactions(searchFilter).subscribe({
      next: (data: any) => {
        this.tableData = [];
        data.DailyTransaction.forEach((response: any) => {         
          this.tableData.push({
            sequenceNo : response[0], 
            transactionStatus: response[1],
            entryDateAndTime: response[2],
            entryLoginUserName: response[3],
            vehiclePlateNo: response[4],
            customerInfo: response[5],
            productCode: response[6], 
          });
        });

      },
      error: (error) => {
        this.tableData = [];
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

 
}
