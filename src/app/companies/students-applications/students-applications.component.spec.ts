import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsApplicationsComponent } from './students-applications.component';

describe('StudentsApplicationsComponent', () => {
  let component: StudentsApplicationsComponent;
  let fixture: ComponentFixture<StudentsApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
