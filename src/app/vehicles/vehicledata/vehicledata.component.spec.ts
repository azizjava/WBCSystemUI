import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleDataComponent } from './vehicledata.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('VehicleDataComponent', () => {
  let component: VehicleDataComponent;
  let fixture: ComponentFixture<VehicleDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()],
      declarations: [ VehicleDataComponent ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
