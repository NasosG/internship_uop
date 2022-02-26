import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputPreviewComponent } from './sheet-output-preview.component';

describe('SheetOutputPreviewComponent', () => {
  let component: SheetOutputPreviewComponent;
  let fixture: ComponentFixture<SheetOutputPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
