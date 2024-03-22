import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services';
import { TransactionsService } from '../transactions.service';
import { DongleData } from 'src/app/models/dongledata.model';
import { TranslateService } from '@ngx-translate/core';


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
  public dongleInfo: DongleData;
  private _dongleErrorMsg ="";
  public showHideCamera :boolean = true;

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
    private translate: TranslateService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this._getTranslatedText();
    if(this.route.snapshot.data["dongleData"]){
      const dongleDataInfo = this.route.snapshot.data["dongleData"];
      if (typeof dongleDataInfo === 'string' || dongleDataInfo instanceof String ) {
        this.alertService.error(this._dongleErrorMsg, true);
        this.router.navigate(['/dashboard/transactions'],  {relativeTo: this.route});        
      }
      this.dongleInfo = dongleDataInfo;
    }
    this.route.queryParams.subscribe((params) => {
      this.sequenceno = params['sequenceno'];
      this.actionName = params['action'];
      this.sequenceno && this._getTransactionById();
    });

    this.selectedScaleType = localStorage.getItem('weightScaleType') || 'KG';    
    this.showHideCamera = ((localStorage.getItem('cameraStatus') ||  'true') === 'true') ;
  }

  public changeCard(isForward: boolean = true) {
    this.actionItem = { isFirst: !isForward, isLast: isForward };
  }

  public onWeightChange(event :number):void{
    this.weight = event;
  }

  public onTransactionDataChanged(data:any):void {
    this.transactionData = {...data};
  }

  public onsequenceNoChange(sequenceNo: any) :void {
    this.sequenceno = sequenceNo;
    this.sequenceno && this._getTransactionById();    
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

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this._dongleErrorMsg = this.translate.instant('transactions.data.dongleerror');      
    });
  }
}
