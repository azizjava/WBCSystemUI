import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.scss']
})
export class TransportersComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['code', 'name', 'contactPerson', 'mobileNo', 'phoneNo', 'faxNo', 'address', 'actions'];

  public searchInput:string ='';
  public staticText: any = {};

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.getTranslatedText();

  }

  addnewRecord(): void {
    console.log('Add new Record!!');
  }

  searchValueChanged(value: string) { 
   this.searchInput =value;
  }

  selectedRecord(row: any, action: string) { }

  private getTranslatedText(): void {

    this.translate.get(['']).subscribe((translated: string) => {

      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchtransporters')
      }

    });


  }

}
