import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DateRange, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GlobalConstants } from 'src/app/common';
import { dateRange, tableOperation, transactionFilter } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'], 
})
export class ListTableComponent implements OnInit, OnChanges, OnDestroy   {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
  this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() tblColumns: string[] = [];
  @Input() tableData: any = [];
  @Input() sortColumn: any = null;
  @Input() visibleColumns: string[] = [];
  @Input() componentName: string = '';
  @Input() showPrintIcon: boolean = false;

  @Input() disableAdd: boolean = false;
  @Input() disableEdit: boolean = false;

  @Output() actionEvent = new EventEmitter<tableOperation>();
  @Output() dateSelectionEvent = new EventEmitter<transactionFilter>();
  @Output() sequenceNoChange = new EventEmitter<string>();

  @Output() pageOptionChange = new EventEmitter<any>();
  @Output() sortOptionChange = new EventEmitter<any>();

  public searchControl: UntypedFormControl = new UntypedFormControl('');
  public dataSource!: MatTableDataSource<any>;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public displayedColumns: string[] = [];
  public rangeGroup: FormGroup;
  public placeholderText: string = '';
  public sequenceNo: string = '';

  private debounce: number = 400;

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.authenticationService.currentUser.subscribe((x) => {
      if (x) {
        this.translate.setDefaultLang(x?.language || 'en');
        translate.use(x?.language);
      }
    });
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  public ngOnInit(): void {
    this.translatePaginator();
    this.dataSource = new MatTableDataSource(this.tableData);

    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((value) => {
        this.getFilteredData(value);
      });

    this.sort.sort({
      id: this.sortColumn?.name,
      start: this.sortColumn?.dir,
    } as MatSortable);
    this.dataSource.sort = this.sort;
    this.displayedColumns = this.tblColumns;
    this._changeColumns(window?.innerWidth > 900 ? true : false);

    const dateRangeStorage:any = JSON.parse(localStorage.getItem('selDateRange') || '{}');
    let fromDate, toDate ;

    
    if(dateRangeStorage && dateRangeStorage.startDate && dateRangeStorage.endDate) {
      fromDate = GlobalConstants.commonFunction.parseDate(dateRangeStorage.startDate);
      toDate = GlobalConstants.commonFunction.parseDate(dateRangeStorage.endDate);
    }
    else {
      fromDate = GlobalConstants.commonFunction.getOlderDate(-1);
      toDate = new Date();
    }
    this.rangeGroup = new FormGroup({
      fromDate: new FormControl<Date | null>(fromDate),
      toDate: new FormControl<Date | null>(toDate),
    });

    const dataRage: transactionFilter = {
      startDate: GlobalConstants.commonFunction.getFormattedSelectedDate(fromDate),
      endDate: GlobalConstants.commonFunction.getFormattedSelectedDate(toDate),
      sequenceNo : ""
    };
    this.dateSelectionEvent.emit(dataRage);
    this.placeholderText = `placeholder.search${this.componentName}`;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['tableData']?.firstChange) {
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    this.rangeGroup = new FormGroup({
      fromDate: new FormControl<Date | null>(
        GlobalConstants.commonFunction.getOlderDate(-1)
      ),
      toDate: new FormControl<Date | null>(new Date()),
    });
  }
  

  async translatePaginator() {
    const label = await this.translate.get('common.itemsperpagelabel').toPromise();
    //this.paginator._intl.itemsPerPageLabel = label;
    this.dataSource.paginator = this.paginator;
  }

  public selectedRecord(row: any, action: string) {
    const data: tableOperation = { data: row, action: action };
    this.actionEvent.emit(data);
  }

  public trackByFn(index: number, item: any) {
    return item;
  }

  public getTableHeader(columnName: string) {
    return this.translate.instant(
      `${this.componentName}.tbl_header.${columnName.toString().toLowerCase()}`
    );
  }

  public dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    if (dateRangeEnd.value) {
      const dataRage: transactionFilter = {
        startDate: dateRangeStart.value,
        endDate:dateRangeEnd.value,
        sequenceNo : this.sequenceNo
      };
      this.dateSelectionEvent.emit(dataRage);
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this._changeColumns(event?.target?.innerWidth > 900 ? true : false);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.getFilteredData(filterValue);
  }

  onSeqInputChange(newValue:any){
    this.sequenceNo =newValue;
  }

  onSeqNoChange(event: HTMLInputElement){
    this.sequenceNoChange.emit(event.value);
  }

  getFilteredData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private _changeColumns(isDesktop: boolean = true) {
    this.displayedColumns = isDesktop ? this.tblColumns : this.visibleColumns;
  }

  onPageChange($event: any) {
    this.pageOptionChange.emit($event);
  }

  onSortData(sort: Sort) {
   this.sortOptionChange.emit(sort);
  }
}
