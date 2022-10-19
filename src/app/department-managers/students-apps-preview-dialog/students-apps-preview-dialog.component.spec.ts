import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsAppsPreviewDialogComponent } from './students-apps-preview-dialog.component';

describe('StudentsAppsPreviewDialogComponent', () => {
  let component: StudentsAppsPreviewDialogComponent;
  let fixture: ComponentFixture<StudentsAppsPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsAppsPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsAppsPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
