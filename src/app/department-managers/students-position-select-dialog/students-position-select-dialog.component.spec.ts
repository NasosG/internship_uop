import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPositionSelectDialogComponent } from './students-position-select-dialog.component';

describe('StudentsPositionSelectDialogComponent', () => {
  let component: StudentsPositionSelectDialogComponent;
  let fixture: ComponentFixture<StudentsPositionSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsPositionSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsPositionSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
