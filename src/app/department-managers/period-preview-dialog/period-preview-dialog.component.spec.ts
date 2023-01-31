import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodPreviewDialogComponent } from './period-preview-dialog.component';

describe('PeriodPreviewDialogComponent', () => {
  let component: PeriodPreviewDialogComponent;
  let fixture: ComponentFixture<PeriodPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
