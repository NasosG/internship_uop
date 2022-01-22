import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoginTermsComponent } from './student-login-terms.component';

describe('StudentLoginTermsComponent', () => {
  let component: StudentLoginTermsComponent;
  let fixture: ComponentFixture<StudentLoginTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentLoginTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLoginTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
