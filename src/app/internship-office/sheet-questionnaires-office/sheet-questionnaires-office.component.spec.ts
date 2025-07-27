import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetQuestionnairesOfficeComponent } from './sheet-questionnaires-office.component';

describe('SheetQuestionnairesOfficeComponent', () => {
  let component: SheetQuestionnairesOfficeComponent;
  let fixture: ComponentFixture<SheetQuestionnairesOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetQuestionnairesOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetQuestionnairesOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
