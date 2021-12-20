import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit, AfterViewInit, OnDestroy {


    @Input() placeholderText: string = "";
    @Input() tblColumns: string[] = [];
    @Input() tableData: any = [];
    @Output() addNew = new EventEmitter();

    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


    constructor() {

    }

    public ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.tableData);
    }

    public ngAfterViewInit(): void {
     //   this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public addnewRecord(): void {
        this.addNew.emit();
    }

    public selectedRecord(row: any, action: string) {

     }

    public trackByFn(index: number, item: any) {
        return item;
    }

   
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public ngOnDestroy(): void {

    }




}
