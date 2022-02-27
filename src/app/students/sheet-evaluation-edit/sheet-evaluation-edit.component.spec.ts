import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetEvaluationEditComponent } from './sheet-evaluation-edit.component';

describe('SheetEvaluationEditComponent', () => {
  let component: SheetEvaluationEditComponent;
  let fixture: ComponentFixture<SheetEvaluationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetEvaluationEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetEvaluationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
