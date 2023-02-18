import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsInterestAppPrintableComponent } from './students-interest-app-printable.component';

describe('StudentsInterestAppPrintableComponent', () => {
  let component: StudentsInterestAppPrintableComponent;
  let fixture: ComponentFixture<StudentsInterestAppPrintableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsInterestAppPrintableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsInterestAppPrintableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
