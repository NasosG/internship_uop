import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputPreviewComponent } from './sheet-input-preview.component';

describe('SheetInputPreviewComponent', () => {
  let component: SheetInputPreviewComponent;
  let fixture: ComponentFixture<SheetInputPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
