import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputOfficeComponent } from './sheet-input-office.component';

describe('SheetInputOfficeComponent', () => {
  let component: SheetInputOfficeComponent;
  let fixture: ComponentFixture<SheetInputOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
