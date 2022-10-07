import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportersdataComponent } from './transportersdata.component';

describe('TransportersdataComponent', () => {
  let component: TransportersdataComponent;
  let fixture: ComponentFixture<TransportersdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportersdataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportersdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
