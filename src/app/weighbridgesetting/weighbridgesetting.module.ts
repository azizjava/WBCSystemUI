import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeighbridgesettingRoutingModule } from './weighbridgesetting-routing.module';
import { WeighbridgesettingComponent } from './weighbridgesetting.component';


@NgModule({
  declarations: [
    WeighbridgesettingComponent
  ],
  imports: [
    CommonModule,
    WeighbridgesettingRoutingModule
  ]
})
export class WeighbridgesettingModule { }
