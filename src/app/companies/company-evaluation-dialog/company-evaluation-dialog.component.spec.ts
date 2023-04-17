import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEvaluationDialogComponent } from './company-evaluation-dialog.component';

describe('CompanyEvaluationDialogComponent', () => {
  let component: CompanyEvaluationDialogComponent;
  let fixture: ComponentFixture<CompanyEvaluationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEvaluationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
