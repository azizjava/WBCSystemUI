import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { weightBridgeComponent } from './weightbridge.component';


describe('weightBridgeComponent', () => {
  let component: weightBridgeComponent;
  let fixture: ComponentFixture<weightBridgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,
        MatInputModule,
        BrowserAnimationsModule, 
        FormsModule,
        TranslateModule.forRoot()],
      declarations: [ weightBridgeComponent ],     
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(weightBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
