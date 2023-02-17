import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPositionAssignmentDialogComponent } from './students-position-assignment-dialog.component';

describe('StudentsPositionAssignmentDialogComponent', () => {
  let component: StudentsPositionAssignmentDialogComponent;
  let fixture: ComponentFixture<StudentsPositionAssignmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsPositionAssignmentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsPositionAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
