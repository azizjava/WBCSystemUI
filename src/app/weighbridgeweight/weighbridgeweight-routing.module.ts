import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightbridgeWeightComponent } from './weighbridgeweight.component';

const routes: Routes = [{ path: '', component: WeightbridgeWeightComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighbridgeWeightRoutingModule { }
