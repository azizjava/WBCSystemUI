import { ComponentFixture, TestBed } from '@angular/core/testing';

import { entryDataComponent } from './entrydata.component';

describe('TransactiondataComponent', () => {
  let component: entryDataComponent;
  let fixture: ComponentFixture<entryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ entryDataComponent ]
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
