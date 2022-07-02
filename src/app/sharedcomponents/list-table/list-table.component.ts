import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { tableOperation } from 'src/app/models';

@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() placeholderText: string = "";
    @Input() tblColumns: string[] = [];
    @Input() tableData: any = [];
    @Output() actionEvent =  new EventEmitter<tableOperation>();

    public searchControl: FormControl = new FormControl('');

    private debounce: number = 400;

    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatSort) sort!: MatSort;

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
        this.dataSource.sort = this.sort;
    }

    

    public selectedRecord(row: any, action: string) {

        const data:tableOperation = {data: row, action: action};

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
