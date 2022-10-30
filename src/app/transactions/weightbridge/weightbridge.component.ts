import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  public constructor() {}

  public ngOnInit(): void {
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
}
