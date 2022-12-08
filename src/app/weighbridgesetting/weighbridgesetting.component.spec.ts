import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighbridgesettingComponent } from './weighbridgesetting.component';

describe('WeighbridgesettingComponent', () => {
  let component: WeighbridgesettingComponent;
  let fixture: ComponentFixture<WeighbridgesettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeighbridgesettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighbridgesettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
