import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../../transactions.service';
import { AlertService } from 'src/app/services';


@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.scss'],
  providers: []
})

export class viewTransactionComponent implements OnInit {
  images :any;
  public transactionData:any;
  public entryData:any;
  public exitData:any;

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
  ) {
   
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sequenceNo = params.get('id') || '';
      
      sequenceNo && this._getTransactionById(sequenceNo);
    });

    this.images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  }
  
  private _getTransactionById(sequenceNo: string): void {
    this.httpService.getTransactionById(sequenceNo).subscribe({
      next: (data: any) => {
        if (data) {
          this.transactionData = data;
          this.entryData = data.dailyTransactionEntry;
          this.exitData = data.dailyTransactionExit;
        }
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  } 

}

