import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDataComponent } from './transactiondata/transactiondata.component';
import { TransactionsListComponent } from './transactionlist.component';

const routes: Routes = [
  { path: '', component: TransactionsListComponent },
  { path: 'add', component: TransactionDataComponent },
  { path: 'edit/:id', component: TransactionDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
