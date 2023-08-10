import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsListComponent } from './transactionlist.component';
import { TransactionDataComponent } from './transactiondata/transactiondata.component';
import { entryDataComponent } from './transactiondata/entrydata/entrydata.component';
import { exitDataComponent } from './transactiondata/exitdata/exitdata.component';
import { weightBridgeComponent } from './weightbridge/weightbridge.component';
import { DriverDataComponent } from './driverdata/driverdata.component';
import { viewTransactionComponent } from './transactiondata/viewtransaction/viewtransaction.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    TransactionsListComponent,
    TransactionDataComponent,
    entryDataComponent,
    exitDataComponent,
    viewTransactionComponent,
    weightBridgeComponent,
    DriverDataComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxGalleryModule,
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
