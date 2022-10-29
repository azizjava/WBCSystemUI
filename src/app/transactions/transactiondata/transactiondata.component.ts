import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactiondata.component.html',
  styleUrls: ['./transactiondata.component.scss'],
})
export class TransactionDataComponent implements OnInit {   
  public actionItem: any = { isFirst: true, isLast: false, activeItem: 0 };
  public id: string;
  public isAddMode: boolean;
  public staticText: any = {};
  public weight:number =0;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    this.isAddMode = !this.id;
    this._getTranslatedText();
  }

  public changeCard(isForward: boolean = true) {
    this.actionItem = { isFirst: !isForward, isLast: isForward };
  }

  public onWeightChange(event :number):void{
    this.weight = event;
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        entryHeaderText: this.translate.instant('transactions.data.entry.header'),
        exitHeaderText: this.translate.instant('transactions.data.exit.header'),
        supplierName: this.translate.instant('suppliers.tbl_header.suppliername'),       
      };
    });
  }
}
