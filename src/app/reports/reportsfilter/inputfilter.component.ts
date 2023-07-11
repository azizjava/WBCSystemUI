import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { modelDialog, PrintLayout } from 'src/app/models';
import { AlertService } from 'src/app/services';
import { LayoutSetupComponent } from '../layoutsetup/layoutsetup.component';
import { ClientTemplateComponent } from '../clienttemplate/clienttemplate.component';

@Component({
  selector: 'app-reportsinputfilter',
  templateUrl: './inputfilter.component.html',
  styleUrls: ['./inputfilter.component.scss'],
})
export class InputFilterComponent implements OnInit {
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public staticText: any = {};
  public reportType: any = [];
  public selectedReportType: string = '1';

  public adminddlControl = new FormControl('');
  public transactionddlControl = new FormControl('');
  public adminReportOptions: any = [];
  public transactionReportOptions: any = [];
  filteredAdminReportsOptions: Observable<any[]>;
  filteredTransactionReportsOptions: Observable<any[]>;
  public fromDateControl = new FormControl(new Date(Date.now() - 86400000 * 2));
  public toDateControl = new FormControl(moment().toDate());


  constructor(
    private translate: TranslateService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reportType = [
      { name: 'admin', value: '1', checked: true },
      { name: 'transaction', value: '2', checked: false },
    ];
    this.adminReportOptions =  GlobalConstants.commonFunction.getAdminReportsOption();
    this.transactionReportOptions = GlobalConstants.commonFunction.getTransactionReportsOption();
    this.filteredAdminReportsOptions = this.adminddlControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(this.adminReportOptions, value || ''))
    );

    this.filteredTransactionReportsOptions =
      this.transactionddlControl.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filter(this.transactionReportOptions, value || '')
        )
      );

  }

  private _filter(list: any[], value: string): any[] {
    const filterValue = value.toLowerCase();

    return list.filter((option: any) =>
      option.value.toLowerCase().includes(filterValue)
    );
  }

  public trackByFn(index: number, item: any) {
    return item.value;
  }

  public onReportTypeChange(event: MatRadioChange) {
    this.selectedReportType = event.value;
  }

  public openSettings(): void {
    const dialogData = {
      headerText: 'Information',
      data: '',
      actionName: '',
    };
    this.openDialog(dialogData);
  }

  public openClientSettings(): void {
    const dialogData = {
      headerText: 'Information',
      data: '',
      actionName: '',
    };
    this.openClientDialog(dialogData);
  }

  public fetchReports(): void {
    const fromDateControl = this.fromDateControl.value;
    const toDateControl = this.toDateControl.value;
    const selectedReportType = this.selectedReportType;
    const reportName =
      this.selectedReportType === '1'
        ? this.adminddlControl.value
        : this.transactionddlControl.value;
    console.log(
      `fromDate  : ${fromDateControl} , toDate  : ${toDateControl} , ReportType : ${selectedReportType} , reportName : ${reportName} ,`
    );
  }

  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog-type';

    const dialogRef = this.matDialog.open(LayoutSetupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.alertService.success(` updated successfully`);
      }
    });
  }

  private openClientDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(ClientTemplateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => { });
  }
  
}
