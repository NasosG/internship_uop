import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInternshipEvaluationComponent } from './sheet-internship-evaluation.component';

describe('SheetInternshipEvaluationComponent', () => {
  let component: SheetInternshipEvaluationComponent;
  let fixture: ComponentFixture<SheetInternshipEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInternshipEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInternshipEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
