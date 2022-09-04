import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { tableOperation } from 'src/app/models';

@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @Input() placeholderText: string = "";
    @Input() tblColumns: string[] = [];
    @Input() tableData: any = [];
    @Input() sortColumn: any = null;
    @Input() visibleColumns: string[] = [];
    @Input() componentName: string = "";


    @Output() actionEvent = new EventEmitter<tableOperation>();

    public searchControl: FormControl = new FormControl('');
    public dataSource!: MatTableDataSource<any>;
    public pageSize: number = 10;
    public pageSizeOptions: number[] = [5, 10, 25, 100];
    public displayedColumns: string[] = [];

    private debounce: number = 400;

    constructor(private translate: TranslateService) { }

    public ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.tableData);

        this.searchControl.valueChanges
            .pipe(debounceTime(this.debounce), distinctUntilChanged())
            .subscribe(value => {
                this.getFilteredData(value);
            });

        this._changeColumns(window?.innerWidth > 900 ? true : false);
        this.sort.sort(({ id: this.sortColumn?.name, start: this.sortColumn?.dir }) as MatSortable);
        this.dataSource.sort = this.sort;
        this.displayedColumns = this.tblColumns;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (!changes['tableData'].firstChange) {
            this.dataSource = new MatTableDataSource(this.tableData);
        }
      }

    public ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = this.translate.instant("common.itemsperpagelabel");
    }   

    public selectedRecord(row: any, action: string) {
        const data: tableOperation = { data: row, action: action };
        this.actionEvent.emit(data);
    }

    public trackByFn(index: number, item: any) {
        return item;
    }

    public getTableHeader(columnName: string) {
        
        return this.translate.instant(`${this.componentName}.tbl_header.${columnName.toString().toLowerCase()}`);
    }

    @HostListener('window:resize', ['$event'])
    private onResize(event: any) {
        this._changeColumns(event?.target?.innerWidth > 900 ? true : false);
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.getFilteredData(filterValue);
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



}
