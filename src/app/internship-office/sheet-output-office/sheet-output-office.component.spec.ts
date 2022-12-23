import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputOfficeComponent } from './sheet-output-office.component';

describe('SheetOutputOfficeComponent', () => {
  let component: SheetOutputOfficeComponent;
  let fixture: ComponentFixture<SheetOutputOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
