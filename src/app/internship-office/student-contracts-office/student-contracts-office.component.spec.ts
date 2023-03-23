import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentContractsOfficeComponent } from './student-contracts-office.component';

describe('StudentContractsOfficeComponent', () => {
  let component: StudentContractsOfficeComponent;
  let fixture: ComponentFixture<StudentContractsOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentContractsOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentContractsOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
