import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { WeightBridgeWeightService } from './weighbridgeweight.service';

@Component({
  selector: 'app-weightbridgeweight',
  templateUrl: './weighbridgeweight.component.html',
  styleUrls: ['./weighbridgeweight.component.scss'],
})
export class WeightbridgeWeightComponent {
  constructor(private httpService: WeightBridgeWeightService) {}

  public radioChange($event: MatRadioChange) {
    console.log($event.source.name, $event.value);
  }
}
