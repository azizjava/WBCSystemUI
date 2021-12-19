import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedcomponentsRoutingModule } from './sharedcomponents-routing.module';
import { ListFilterComponent } from './list-filter/list-filter.component';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListTableComponent } from './list-table/list-table.component';
import { DataTablesModule } from 'angular-datatables';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    ListFilterComponent,
    ListTableComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedcomponentsRoutingModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ],
  exports: [ListFilterComponent, ListTableComponent]
})
export class SharedcomponentsModule { }
