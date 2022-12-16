import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightbridgeListComponent } from './weightbridgelist.component';

const routes: Routes = [{ path: '', component: WeightbridgeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighbridgesettingRoutingModule { }
