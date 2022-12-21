import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputPreviewDialogComponent } from './sheet-output-preview-dialog.component';

describe('SheetOutputPreviewDialogComponent', () => {
  let component: SheetOutputPreviewDialogComponent;
  let fixture: ComponentFixture<SheetOutputPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
