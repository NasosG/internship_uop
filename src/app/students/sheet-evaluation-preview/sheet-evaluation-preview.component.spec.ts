import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetEvaluationPreviewComponent } from './sheet-evaluation-preview.component';

describe('SheetEvaluationPreviewComponent', () => {
  let component: SheetEvaluationPreviewComponent;
  let fixture: ComponentFixture<SheetEvaluationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetEvaluationPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetEvaluationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
