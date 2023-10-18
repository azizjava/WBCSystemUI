import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateComponent } from './template.component';
import { TemplateRoutingModule } from './template-routing.module';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { TemplateDataComponent } from './templatedata/templatedata.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    TemplateComponent,
    TemplateDataComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TemplateRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false
    })
  ]
})
export class TemplateModule { }
