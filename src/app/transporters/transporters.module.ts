import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportersRoutingModule } from './transporters-routing.module';
import { TransportersComponent } from './transporters.component';


@NgModule({
  declarations: [
    TransportersComponent
  ],
  imports: [
    CommonModule,
    TransportersRoutingModule
  ]
})
export class TransportersModule { }
