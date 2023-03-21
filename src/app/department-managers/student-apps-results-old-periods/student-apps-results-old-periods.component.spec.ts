import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAppsResultsOldPeriodsComponent } from './student-apps-results-old-periods.component';

describe('StudentAppsResultsOldPeriodsComponent', () => {
  let component: StudentAppsResultsOldPeriodsComponent;
  let fixture: ComponentFixture<StudentAppsResultsOldPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAppsResultsOldPeriodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAppsResultsOldPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
