import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySelectionDialogComponent } from './company-selection-dialog.component';

describe('CompanySelectionDialogComponent', () => {
  let component: CompanySelectionDialogComponent;
  let fixture: ComponentFixture<CompanySelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanySelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
