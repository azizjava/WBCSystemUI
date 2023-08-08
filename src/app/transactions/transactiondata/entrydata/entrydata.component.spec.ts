import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { entryDataComponent } from './entrydata.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacyAutocomplete as MatAutocomplete } from '@angular/material/legacy-autocomplete';


describe('entryDataComponent', () => {
  let component: entryDataComponent;
  let fixture: ComponentFixture<entryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule, 
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        TranslateModule.forRoot()],
      declarations: [ entryDataComponent, MatAutocomplete  ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(entryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
