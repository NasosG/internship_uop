import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputPreviewDialogComponent } from './sheet-input-preview-dialog.component';

describe('SheetInputPreviewDialogComponent', () => {
  let component: SheetInputPreviewDialogComponent;
  let fixture: ComponentFixture<SheetInputPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
