import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentContractsComponent } from './student-contracts.component';

describe('StudentContractsComponent', () => {
  let component: StudentContractsComponent;
  let fixture: ComponentFixture<StudentContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
