import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChooseDepartmentComponent } from './student-choose-department.component';

describe('StudentChooseDepartmentComponent', () => {
  let component: StudentChooseDepartmentComponent;
  let fixture: ComponentFixture<StudentChooseDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentChooseDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentChooseDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
