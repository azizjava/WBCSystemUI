import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { InputFilterComponent } from './reportsfilter/inputfilter.component';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { LayoutSetupComponent } from './layoutsetup/layoutsetup.component';
import { ClientTemplateComponent } from './clienttemplate/clienttemplate.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    ReportsComponent,
    InputFilterComponent,
    LayoutSetupComponent,
    ClientTemplateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    SharedcomponentsModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false
    }),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    DragDropModule,
  ]
})
export class ReportsModule { }
