import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationDatesChangeDialogComponent } from './implementation-dates-change-dialog.component';

describe('ImplementationDatesChangeDialogComponent', () => {
  let component: ImplementationDatesChangeDialogComponent;
  let fixture: ComponentFixture<ImplementationDatesChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImplementationDatesChangeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationDatesChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
