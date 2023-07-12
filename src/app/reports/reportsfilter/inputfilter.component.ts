import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { modelDialog, ReportFormat } from 'src/app/models';
import { AlertService } from 'src/app/services';
import { LayoutSetupComponent } from '../layoutsetup/layoutsetup.component';
import { ClientTemplateComponent } from '../clienttemplate/clienttemplate.component';
import { ReportsService } from '../reports.service';

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
  public userLanguages: any = [];
  public selectedReportType: string = '';
  public selectedLang: string = 'en';
  public menuOption: any = [];
  public canEnableDownload:boolean = false;

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
    private matDialog: MatDialog,
    private httpService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.reportType = [
      { name: 'admin', value: 'admin', checked: true },
      { name: 'transaction', value: 'transaction', checked: false },
    ];
    this.menuOption = [{ name: 'PDF', value: 'pdf' },{ name: 'HTM', value: 'htm' }, { name: 'XLSX', value: 'xlsx' }, { name: 'CSV', value: 'csv' },]
    this.userLanguages = GlobalConstants.commonFunction.getUserLanguages().map(e => Object.assign(e, {checked: e.key === this.translate.currentLang}));
    this.selectedLang = this.translate.currentLang;
    this.selectedReportType = this.reportType[0].value;
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

      this.adminddlControl.valueChanges.subscribe(
        (value: any) =>  {
          this.canEnableDownload = value !=='' ? true :false ;
        }        
      );
  }

  private _filter(list: any[], value: string): any[] {
    const filterValue = value.toLowerCase();
    this.canEnableDownload = value !=='' ? true :false ;
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

  public onLangChange(event: MatRadioChange) {
    this.selectedLang = event.value;
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

  public fetchReports(downloadFormat: string): void {
    const startDate = this.fromDateControl.value?.getTime().toString() || "";
    const endDate = this.toDateControl.value?.getTime().toString() || "";
    const reportName =
      this.selectedReportType === 'admin'
        ? this.adminddlControl.value
        : this.transactionddlControl.value;
    const format: ReportFormat = {
      startDate: startDate,
      endDate: endDate,
      locale: this.selectedLang,
      reportName: reportName?.toLocaleLowerCase().replace(/ +/g, "") || '',
      fileFormat: downloadFormat,
      reportType: this.selectedReportType,
    };
    this._getReportData(format);
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

  private _getReportData(data: ReportFormat): void {
    this.httpService.findReport(data).subscribe({
      next: (data: any) => {
       console.log(data);
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
  
}
