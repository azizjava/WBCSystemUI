import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { tableOperation } from 'src/app/models';

@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @Input() placeholderText: string = "";
    @Input() tblColumns: string[] = [];
    @Input() tableData: any = [];
    @Input() sortColumn: any = null;

    @Output() actionEvent = new EventEmitter<tableOperation>();

    public searchControl: FormControl = new FormControl('');
    public dataSource!: MatTableDataSource<any>;
    public pageSize: number = 10;
    public pageSizeOptions: number[] = [5, 10, 25, 100];

    private debounce: number = 400;

    constructor() { }

    public ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.tableData);

        this.searchControl.valueChanges
            .pipe(debounceTime(this.debounce), distinctUntilChanged())
            .subscribe(value => {
                this.getFilteredData(value);
            });
    }

    public ngAfterViewInit(): void {
        this.sort.sort(({ id: this.sortColumn?.name, start: this.sortColumn?.dir }) as MatSortable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    public onPageChange(pe: PageEvent) {
        console.log(pe.pageIndex);
    }

    public selectedRecord(row: any, action: string) {

        const data: tableOperation = { data: row, action: action };

        this.actionEvent.emit(data);
    }

    public trackByFn(index: number, item: any) {
        return item;
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

    public ngOnDestroy(): void {

    }




}
