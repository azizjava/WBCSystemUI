import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WeightbridgeListComponent } from '../weightbridgelist.component';


describe('WeightbridgeListComponent', () => {
  let component: WeightbridgeListComponent;
  let fixture: ComponentFixture<WeightbridgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,      
        TranslateModule.forRoot()],
      declarations: [ WeightbridgeListComponent ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightbridgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
