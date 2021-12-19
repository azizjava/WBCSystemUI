import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NationalityRoutingModule } from './nationality-routing.module';
import { NationalityComponent } from './nationality.component';
import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    NationalityComponent
  ],
  imports: [
    CommonModule,
    NationalityRoutingModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false
    })
  ]
})
export class NationalityModule { }
