import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetQuestionnairesComponent } from './sheet-questionnaires.component';

describe('SheetQuestionnairesComponent', () => {
  let component: SheetQuestionnairesComponent;
  let fixture: ComponentFixture<SheetQuestionnairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetQuestionnairesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetQuestionnairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
