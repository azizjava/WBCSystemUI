import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from './customers.component';
import { CustomerdataComponent } from './customerdata/customerdata.component';
import { CustomersRoutingModule } from './customers-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerdataComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomersRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ]
})
export class CustomersModule { }
