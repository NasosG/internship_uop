import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsSheetsComponent } from './ops-sheets.component';

describe('OpsSheetsComponent', () => {
  let component: OpsSheetsComponent;
  let fixture: ComponentFixture<OpsSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsSheetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
