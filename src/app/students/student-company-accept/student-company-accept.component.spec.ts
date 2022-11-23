import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCompanyAcceptComponent } from './student-company-accept.component';

describe('StudentCompanyAcceptComponent', () => {
  let component: StudentCompanyAcceptComponent;
  let fixture: ComponentFixture<StudentCompanyAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCompanyAcceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCompanyAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
