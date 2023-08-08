import { NgModule } from '@angular/core';

import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatDividerModule} from '@angular/material/divider';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';


const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatDividerModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  ScrollingModule,
  MatSlideToggleModule,
  MatMenuModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
