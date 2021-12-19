import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {

    @Input() placeholderText: string = "";
    @Output() addNew = new EventEmitter();
    @Output() inputValueChanged = new EventEmitter<string>();

    public searchControl: FormControl = new FormControl('');

    private debounce: number = 400;

    constructor() { }

    ngOnInit(): void {

        this.searchControl.valueChanges
            .pipe(debounceTime(this.debounce), distinctUntilChanged())
            .subscribe(value => {
                this.inputValueChanged.emit(value);
            });
    }

    public addnewRecord(): void {
        this.addNew.emit();
    }

}
