import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipCompletionDialogComponent } from './internship-completion-dialog.component';

describe('InternshipCompletionDialogComponent', () => {
  let component: InternshipCompletionDialogComponent;
  let fixture: ComponentFixture<InternshipCompletionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipCompletionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshipCompletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
