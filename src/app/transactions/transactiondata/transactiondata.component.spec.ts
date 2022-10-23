import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDataComponent } from './transactiondata.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


describe('TransactionDataComponent', () => {
  let component: TransactionDataComponent;
  let fixture: ComponentFixture<TransactionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()],
      declarations: [ TransactionDataComponent ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
