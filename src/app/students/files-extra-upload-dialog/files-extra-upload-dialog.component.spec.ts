import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesExtraUploadDialogComponent } from './files-extra-upload-dialog.component';

describe('FilesExtraUploadDialogComponent', () => {
  let component: FilesExtraUploadDialogComponent;
  let fixture: ComponentFixture<FilesExtraUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesExtraUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesExtraUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
