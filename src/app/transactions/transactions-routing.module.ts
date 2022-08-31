import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportersComponent } from '../transporters/transporters.component';

const routes: Routes = [{ path: '', component: TransportersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
