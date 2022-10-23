import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ProductGroupDataComponent } from './productgroupdata.component';


describe('ProductGroupDataComponent', () => {
  let component: ProductGroupDataComponent;
  let fixture: ComponentFixture<ProductGroupDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()],
      declarations: [ ProductGroupDataComponent ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
