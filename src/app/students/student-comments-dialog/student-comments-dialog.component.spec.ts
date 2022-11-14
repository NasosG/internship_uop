import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCommentsDialogComponent } from './student-comments-dialog.component';

describe('StudentCommentsDialogComponent', () => {
  let component: StudentCommentsDialogComponent;
  let fixture: ComponentFixture<StudentCommentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCommentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCommentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
