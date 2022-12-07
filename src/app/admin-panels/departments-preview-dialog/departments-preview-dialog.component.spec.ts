import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsPreviewDialogComponent } from './departments-preview-dialog.component';

describe('DepartmentsPreviewDialogComponent', () => {
  let component: DepartmentsPreviewDialogComponent;
  let fixture: ComponentFixture<DepartmentsPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
