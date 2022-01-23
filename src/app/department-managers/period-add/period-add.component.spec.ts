import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodAddComponent } from './period-add.component';

describe('PeriodAddComponent', () => {
  let component: PeriodAddComponent;
  let fixture: ComponentFixture<PeriodAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
