import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWeighbridgesettingComponent } from './addweighbridgesetting.component';


describe('WeighbridgesettingComponent', () => {
  let component: AddWeighbridgesettingComponent;
  let fixture: ComponentFixture<AddWeighbridgesettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWeighbridgesettingComponent ]
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
