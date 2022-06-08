import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsGenericSignupComponent } from './credentials-generic-signup.component';

describe('CredentialsGenericSignupComponent', () => {
  let component: CredentialsGenericSignupComponent;
  let fixture: ComponentFixture<CredentialsGenericSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialsGenericSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsGenericSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
