import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetEvaluationComponent } from './sheet-evaluation.component';

describe('SheetEvaluationComponent', () => {
  let component: SheetEvaluationComponent;
  let fixture: ComponentFixture<SheetEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetEvaluationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
