import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsPreviewDialogComponent } from './applications-preview-dialog.component';

describe('ApplicationsPreviewDialogComponent', () => {
  let component: ApplicationsPreviewDialogComponent;
  let fixture: ComponentFixture<ApplicationsPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationsPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
