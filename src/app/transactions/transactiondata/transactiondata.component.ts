import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services';
import { TransactionsService } from '../transactions.service';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactiondata.component.html',
  styleUrls: ['./transactiondata.component.scss'],
})
export class TransactionDataComponent implements OnInit {   
  public actionItem: any = { isFirst: true, isLast: false, activeItem: 0 };
  public sequenceno: string;
  public staticText: any = {};
  public weight:number =0;
  public transactionData:any;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sequenceno = params['sequenceno'];
      this.sequenceno && this._getTransactionById();
    });
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

  
  private _getTransactionById(): void {
    this.httpService.getTransactionById(this.sequenceno).subscribe({
      next: (data: any) => {
       this.transactionData = data;  
       
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  }

}
