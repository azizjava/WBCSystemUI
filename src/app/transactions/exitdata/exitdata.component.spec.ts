import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exitDataComponent } from './exitdata.component';


describe('TransactiondataComponent', () => {
  let component: exitDataComponent;
  let fixture: ComponentFixture<exitDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ exitDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(exitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
