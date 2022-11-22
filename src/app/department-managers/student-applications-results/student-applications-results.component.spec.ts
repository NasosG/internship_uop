import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentApplicationsResultsComponent } from './student-applications-results.component';

describe('StudentApplicationsResultsComponent', () => {
  let component: StudentApplicationsResultsComponent;
  let fixture: ComponentFixture<StudentApplicationsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentApplicationsResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentApplicationsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
