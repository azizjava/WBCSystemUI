import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions.component';
import { TransactiondataComponent } from './transactiondata/transactiondata.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactiondataComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TransactionsRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ]
})
export class TransactionsModule { }