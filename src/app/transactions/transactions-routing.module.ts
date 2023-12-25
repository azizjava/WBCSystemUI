import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDataComponent } from './transactiondata/transactiondata.component';
import { TransactionsListComponent } from './transactionlist.component';
import { viewTransactionComponent } from './transactiondata/viewtransaction/viewtransaction.component';
import { printTemplateComponent } from './transactiondata/printTemplate/printtemplate.component';

const routes: Routes = [
  { path: '', component: TransactionsListComponent },
  { path: 'add', component: TransactionDataComponent },
  { path: 'edit/:id', component: TransactionDataComponent },
  { path: 'view/:id', component: viewTransactionComponent },
  { path: 'print/:id', component: printTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
