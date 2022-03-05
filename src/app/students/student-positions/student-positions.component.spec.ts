import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPositionsComponent } from './student-positions.component';

describe('StudentPositionsComponent', () => {
  let component: StudentPositionsComponent;
  let fixture: ComponentFixture<StudentPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentPositionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
