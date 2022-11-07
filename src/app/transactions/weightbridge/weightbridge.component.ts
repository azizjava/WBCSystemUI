import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weightbridge',
  templateUrl: './weightbridge.component.html',
  styleUrls: ['./weightbridge.component.scss'],
})
export class weightBridgeComponent implements OnInit {

  @Input() isFirstScreen : boolean =true; 

  @Output() weightChange:EventEmitter<number> =new EventEmitter<number>();

  public connectStatus: boolean = false;
  public weight:number = 0;
  public staticText: any = {};

  public constructor( private translate: TranslateService,) {}

  public ngOnInit(): void {
    this.getTranslatedText();
    this._calculateWeight(true);
  }

  public weightChangeEvent(): void {
    this._calculateWeight();
    this.weightChange.emit(this.weight);
  }  

  private _calculateWeight(isFirst :boolean = false) : void {
    this.weight = this._randomIntFromInterval();
  }

  private _randomIntFromInterval(min: number =1, max:number =100) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        header: this.translate.instant('transactions.Weighbridge.header'),
        connect: this.translate.instant('transactions.Weighbridge.connect'),
        disconnect: this.translate.instant('transactions.Weighbridge.disconnect'),
        firstweight: this.translate.instant('transactions.Weighbridge.firstweight'),
        secondweight: this.translate.instant('transactions.Weighbridge.secondweight'),
      };
    });
  }
}
