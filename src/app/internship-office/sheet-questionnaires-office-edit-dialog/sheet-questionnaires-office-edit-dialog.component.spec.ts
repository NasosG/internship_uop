import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetQuestionnairesOfficeEditDialogComponent } from './sheet-questionnaires-office-edit-dialog.component';

describe('SheetQuestionnairesOfficeEditDialogComponent', () => {
  let component: SheetQuestionnairesOfficeEditDialogComponent;
  let fixture: ComponentFixture<SheetQuestionnairesOfficeEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetQuestionnairesOfficeEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetQuestionnairesOfficeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
