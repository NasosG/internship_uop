import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeStudentApplicationsComponent } from './office-student-applications.component';

describe('OfficeStudentApplicationsComponent', () => {
  let component: OfficeStudentApplicationsComponent;
  let fixture: ComponentFixture<OfficeStudentApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeStudentApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeStudentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
