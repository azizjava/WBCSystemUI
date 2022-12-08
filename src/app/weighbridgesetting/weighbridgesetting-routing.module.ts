import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeighbridgesettingComponent } from './weighbridgesetting.component';

const routes: Routes = [{ path: '', component: WeighbridgesettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighbridgesettingRoutingModule { }
