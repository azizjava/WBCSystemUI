import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { dateRange, modelDialog, tableOperation, transactionFilter, Transporter } from '../models';
import { AlertService } from '../services';
import { TransactionsService } from './transactions.service';
import { Sort } from '@angular/material/sort';
import { TemplateService } from '../template/template.service';
import { ModaldialogComponent } from '../common/modaldialog/modaldialog.component';

@Component({
  selector: 'app-transporters',
  templateUrl: './transactionlist.component.html',
  styleUrls: ['./transactionlist.component.scss'],
})
export class TransactionsListComponent {
  tblColumns: string[] = [ 'Actions','sequence', 'txstatus', 'entrydate', 'exitdate', 'user', 'vehicle', 'custcode', 'supplier', 'product', 'driver'];
  tableData: any = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'entrydatetime', dir: 'desc' };
  public visibleColumns = [ 'Actions','sequence', 'txstatus'];
  public dateRange: transactionFilter | null;
  public sequenceNo : string ="";
  public totalItems :number = 0;

  private _pageSize :number = 10;
  private _currentPage :number = 0;

  constructor(
    private matDialog: MatDialog,
    private httpService: TransactionsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService1: TemplateService
  ) {

    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        if(!event.url.includes('/dashboard/transactions')){
          localStorage.removeItem('selDateRange');
        }
      }
      
    });
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
      this.router.navigate(['/dashboard/transactions/add'], { queryParams: { sequenceno: dialogData.data?.sequence, action: this.actionName } });
    } 
    else if (this.actionName === 'view') {
      this.router.navigate(['/dashboard/transactions/view', dialogData.data?.sequence ], {relativeTo: this.route});
    } 
    else if (this.actionName === 'print') {
       this.openPrintLayout(dialogData.data?.sequence);
    }else {
      this.router.navigate(['/dashboard/transactions/add'],  {relativeTo: this.route});
    }     
   
  }

  public dateSelectionChangedEvent(dataRage: transactionFilter){
    this.dateRange = dataRage;
    localStorage.setItem('selDateRange', JSON.stringify(this.dateRange));
    this.sequenceNo =dataRage.sequenceNo;    
    this._currentPage = 0;
    this.getAllTransactions();
  }

  onsequenceNoChange(sequenceNo: string) :void {
    this.sequenceNo = sequenceNo;
    this._currentPage = 0;
    this.getAllTransactions();
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
    this.dateRange = null;
  }

  public onPageOptionChange(pageOption: any) :void {
    this._pageSize = pageOption.pageSize;
    this._currentPage = pageOption.pageIndex;
    this.getAllTransactions();
  }

  public onSortOptionChange(sortOption: Sort) :void {
    if(sortOption.active !== this.sortColumn.name && sortOption.direction !== this.sortColumn.dir){
    this.getAllTransactions();
    }
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
    this.httpService.deleteTransaction(selRecord.sequence).subscribe({
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
     pageNo: this._currentPage,
     pageSize:this._pageSize,
     sortOrder: this.sortColumn.dir,
     sortBy:this.sortColumn.name
    };

    if(this.sequenceNo){
      searchFilter.sequenceNo = this.sequenceNo;
    }
    this.httpService.getAllTransactions(searchFilter).subscribe({
      next: (data: any) => {
        this.tableData = [];
        this.totalItems= data["total-items"]; 
        data.DailyTransaction.forEach((response: any) => {         
          this.tableData.push({
            sequence : response[0], 
            txstatus: response[1],
            entrydate: response[2],
            exitdate: response[3],
            user: response[4],
            vehicle: response[5],
            custcode: response[6],
            supplier: response[7],
            product: response[8], 
            driver: response[9], 
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

  private openPrintLayout(sequenceNo :string): void {    
    this.httpService1.processJSON(sequenceNo).subscribe({
      next: (data: any) => {
        if (data) {
          this.openDialog({
            data: data,
            actionName: 'printSetup',
            headerText: 'Print Setup',
          });
        } 
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  }

  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-modalbox';

    const dialogRef = this.matDialog.open(ModaldialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

 
}
