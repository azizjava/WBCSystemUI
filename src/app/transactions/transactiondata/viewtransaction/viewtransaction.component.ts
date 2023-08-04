import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../../transactions.service';
import { AlertService } from 'src/app/services';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.scss'],
  providers: [NgbCarouselConfig]
})

export class viewTransactionComponent implements OnInit {
  public transactionData:any;
  images :any;

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
    config: NgbCarouselConfig
  ) {
    // customize default values of carousels used by this component tree
		config.interval = 1000;
		config.wrap = true;
		config.keyboard = false;
		config.pauseOnHover = true;
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
       this.transactionData = data;  
       
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  } 

}

