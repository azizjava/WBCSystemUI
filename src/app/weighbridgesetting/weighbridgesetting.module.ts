import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeighbridgesettingRoutingModule } from './weighbridgesetting-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WeightbridgeListComponent } from './weightbridgelist.component';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { AddWeighbridgesettingComponent } from './weighbridgedata/addweighbridgesetting.component';
import { WeightbridgeWeightComponent } from './weighbridgeweighttype/weighbridgeweight.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    WeightbridgeListComponent,
    AddWeighbridgesettingComponent,
    WeightbridgeWeightComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    WeighbridgesettingRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ]
})
export class WeighbridgesettingModule { }
