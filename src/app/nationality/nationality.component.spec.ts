import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NationalityComponent } from './nationality.component';


describe('NationalityComponent', () => {
  let component: NationalityComponent;
  let fixture: ComponentFixture<NationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,       
        TranslateModule.forRoot()],
      declarations: [ NationalityComponent ],
      providers:[        
        { provide: MatDialog, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
