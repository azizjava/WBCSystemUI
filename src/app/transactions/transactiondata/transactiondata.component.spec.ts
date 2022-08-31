import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactiondataComponent } from './transactiondata.component';

describe('TransactiondataComponent', () => {
  let component: TransactiondataComponent;
  let fixture: ComponentFixture<TransactiondataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactiondataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
