import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAppsPreviewDialogComponent } from './student-apps-preview-dialog.component';

describe('StudentAppsPreviewDialogComponent', () => {
  let component: StudentAppsPreviewDialogComponent;
  let fixture: ComponentFixture<StudentAppsPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAppsPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAppsPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
