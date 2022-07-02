import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportersRoutingModule } from './transporters-routing.module';
import { TransportersComponent } from './transporters.component';
import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { TransportersdataComponent } from './transportersdata/transportersdata.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    TransportersComponent,
    TransportersdataComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TransportersRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ]
})
export class TransportersModule { }
