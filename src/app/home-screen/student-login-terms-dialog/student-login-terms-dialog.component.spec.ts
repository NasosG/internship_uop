import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoginTermsDialogComponent } from './student-login-terms-dialog.component';

describe('StudentLoginTermsDialogComponent', () => {
  let component: StudentLoginTermsDialogComponent;
  let fixture: ComponentFixture<StudentLoginTermsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentLoginTermsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLoginTermsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
