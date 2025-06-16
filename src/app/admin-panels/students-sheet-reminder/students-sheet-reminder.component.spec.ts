import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsSheetReminderComponent } from './students-sheet-reminder.component';

describe('StudentsSheetReminderComponent', () => {
  let component: StudentsSheetReminderComponent;
  let fixture: ComponentFixture<StudentsSheetReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsSheetReminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsSheetReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
