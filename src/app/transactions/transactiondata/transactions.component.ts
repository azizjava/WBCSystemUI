import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactiondata.component.html',
  styleUrls: ['./transactiondata.component.scss']
})
export class TransactionDataComponent implements OnInit {

 
  public actionItem: any = {isFirst:true, isLast:false, activeItem : 0};


  constructor(private translate: TranslateService) { }

  public ngOnInit(): void {
    console.log("")
  }

  public changeCard(isForward: boolean = true){
    this.actionItem = {isFirst:!isForward, isLast:isForward};
  }
  


}
