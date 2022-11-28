import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, startWith } from 'rxjs';
import { GlobalConstants } from 'src/app/common';

@Component({
  selector: 'app-reportsinputfilter',
  templateUrl: './inputfilter.component.html',
  styleUrls: ['./inputfilter.component.scss'],
})
export class InputFilterComponent implements OnInit {
  public staticText: any = {};
  public reportType: any = [];
  public selectedReportType: string = '1';

  public adminddlControl = new FormControl('');
  public transactionddlControl = new FormControl('');
  public adminReportOptions: any = [];
  public transactionReportOptions: any = [];
  filteredAdminReportsOptions: Observable<any[]>;
  filteredTransactionReportsOptions: Observable<any[]>;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.reportType = [
      { name: 'Admin', value: '1', checked: true },
      { name: 'Transaction', value: '2', checked: false },
    ];

    this.adminReportOptions =
      GlobalConstants.commonFunction.getAdminReportsOption();
    this.transactionReportOptions =
      GlobalConstants.commonFunction.getTransactionReportsOption();

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

  save() {}
}
