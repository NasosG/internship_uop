import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsGenericLoginComponent } from './credentials-generic-login.component';

describe('CredentialsGenericLoginComponent', () => {
  let component: CredentialsGenericLoginComponent;
  let fixture: ComponentFixture<CredentialsGenericLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialsGenericLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsGenericLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
