import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetQuestionnairesEditDialogComponent } from './sheet-questionnaires-edit-dialog.component';

describe('SheetQuestionnairesEditDialogComponent', () => {
  let component: SheetQuestionnairesEditDialogComponent;
  let fixture: ComponentFixture<SheetQuestionnairesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetQuestionnairesEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetQuestionnairesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
