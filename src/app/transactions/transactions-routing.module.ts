import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDataComponent } from './transactiondata/transactions.component';
import { TransactionsListComponent } from './transactionlist.component';

const routes: Routes = [
  { path: '', component: TransactionsListComponent },
  { path: 'add', component: TransactionDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
