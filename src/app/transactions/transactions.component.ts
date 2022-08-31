import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

 
  public actionItem: any = {isFirst:true, isLast:false, activeItem : 0};


  constructor(private translate: TranslateService) { }

  public ngOnInit(): void {
    console.log("")
  }

  public changeCard(isForward: boolean = true){
    this.actionItem = {isFirst:!isForward, isLast:isForward};
  }
  


}
