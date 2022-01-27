import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMatchComponent } from './student-match.component';

describe('StudentMatchComponent', () => {
  let component: StudentMatchComponent;
  let fixture: ComponentFixture<StudentMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
