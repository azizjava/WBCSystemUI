import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public actionName: string ="";
  public weight:number =0;
  public transactionData:any;
  public selectedScaleType :string; 

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sequenceno = params['sequenceno'];
      this.actionName = params['action'];
      this.sequenceno && this._getTransactionById();
    });

    this.selectedScaleType = localStorage.getItem('weightScaleType') || 'KG';
  }

  public changeCard(isForward: boolean = true) {
    this.actionItem = { isFirst: !isForward, isLast: isForward };
  }

  public onWeightChange(event :number):void{
    this.weight = event;
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

  onsequenceNoChange(sequenceNo: any) :void {
    this.sequenceno = sequenceNo;
    this.sequenceno && this._getTransactionById();    
  }

}
