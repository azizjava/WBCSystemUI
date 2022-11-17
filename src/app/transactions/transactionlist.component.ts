import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
export class TransactionsListComponent implements OnInit {
  tblColumns: string[] = ['sequenceNo', 'transactionStatus', 'entryDateAndTime', 'entryLoginUserName',  'vehiclePlateNo', 'transporterCode', 'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'entryDateAndTime', dir: 'desc' };
  public visibleColumns = ['sequenceNo', 'transactionStatus', 'Actions'];

  constructor(
    private translate: TranslateService,
    private matDialog: MatDialog,
    private httpService: TransactionsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getTranslatedText();
    this.getAllTransactions();
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
      this.router.navigate(['/dashboard/transactions/add'], { queryParams: { sequenceno: dialogData.data?.sequenceNo } });
    } else {
      this.router.navigate(['/dashboard/transactions/add'],  {relativeTo: this.route});
    }     
   
  }

  public dateSelectionChangedEvent(dataRage: dateRange){

    console.log(dataRage);
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
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


  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchtransaction'),       
      };
    });
  }

  private getAllTransactions(): void {
    this.httpService.getAllTransactions().subscribe({
      next: (data: any[]) => {
        this.tableData = [];
        data.forEach((response: any) => {         
          this.tableData.push({sequenceNo : response.sequenceNo, 
            transactionStatus: response.transactionStatus,
            entryDateAndTime: response.dailyTransactionEntry?.entryDateAndTime,
            vehiclePlateNo: response.dailyTransactionEntry?.vehiclePlateNo,
            transporterCode: response.dailyTransactionEntry?.transporterCode,
            entryLoginUserName: response.dailyTransactionEntry?.entryLoginUserName,
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
