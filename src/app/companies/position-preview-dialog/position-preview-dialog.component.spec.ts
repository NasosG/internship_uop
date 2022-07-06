import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionPreviewDialogComponent } from './position-preview-dialog.component';

describe('PositionPreviewDialogComponent', () => {
  let component: PositionPreviewDialogComponent;
  let fixture: ComponentFixture<PositionPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
