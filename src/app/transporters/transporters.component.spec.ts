import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';

import { TransportersComponent } from './transporters.component';

describe('TransportersComponent', () => {
  let component: TransportersComponent;
  let fixture: ComponentFixture<TransportersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,       
        TranslateModule.forRoot()],
      declarations: [ TransportersComponent ],
      providers:[
        { provide: MatDialog, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
