import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

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

    dtOptions: DataTables.Settings = {};

    // We use this trigger because fetching the list of persons can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject<any>();


    constructor() {

    }

    public ngOnInit(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 2,
        };

    }

    public ngAfterViewInit(): void {
        //  this.dtTrigger.next();
    }

    public addnewRecord(): void {
        this.addNew.emit();
    }

    public selectedRecord(row: any, action: string) { }

    public trackByFn(index: number, item: any) {
        return item;
    }

    public ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }


}
