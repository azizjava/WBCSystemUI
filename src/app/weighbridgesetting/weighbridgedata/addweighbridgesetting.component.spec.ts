import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWeighbridgesettingComponent } from './addweighbridgesetting.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyAutocomplete as MatAutocomplete } from '@angular/material/legacy-autocomplete';
import { AuthenticationService } from 'src/app/services';
import { WeightBridgeService } from '../weightbridge.service';


describe('WeighbridgesettingComponent', () => {
  let component: AddWeighbridgesettingComponent;
  let fixture: ComponentFixture<AddWeighbridgesettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule, ReactiveFormsModule ,HttpClientModule, TranslateModule.forRoot()],
      declarations: [ AddWeighbridgesettingComponent , MatAutocomplete ],
      providers:[
        AuthenticationService, WeightBridgeService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWeighbridgesettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
