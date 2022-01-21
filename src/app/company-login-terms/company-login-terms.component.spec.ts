import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLoginTermsComponent } from './company-login-terms.component';

describe('CompanyLoginTermsComponent', () => {
  let component: CompanyLoginTermsComponent;
  let fixture: ComponentFixture<CompanyLoginTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLoginTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLoginTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
