import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsApprovedComponent } from './students-approved.component';

describe('StudentsApprovedComponent', () => {
  let component: StudentsApprovedComponent;
  let fixture: ComponentFixture<StudentsApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
