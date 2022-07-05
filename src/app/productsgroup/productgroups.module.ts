import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProductGroupsComponent } from './productgroups.component';
import { ProductGroupDataComponent } from './productgroupdata/productgroupdata.component';
import { ProductsGroupRoutingModule } from './productgroups-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    ProductGroupDataComponent,
   ProductGroupsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ProductsGroupRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false
    })
  ]
})
export class ProductGroupsModule { }
