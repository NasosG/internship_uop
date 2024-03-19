import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFilesViewDialogComponent } from './student-files-view-dialog.component';

describe('StudentFilesViewDialogComponent', () => {
  let component: StudentFilesViewDialogComponent;
  let fixture: ComponentFixture<StudentFilesViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentFilesViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFilesViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
