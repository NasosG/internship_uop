import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMatchedInfoDialogComponent } from './students-matched-info-dialog.component';

describe('StudentsMatchedInfoDialogComponent', () => {
  let component: StudentsMatchedInfoDialogComponent;
  let fixture: ComponentFixture<StudentsMatchedInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsMatchedInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsMatchedInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
