import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputComponent } from './sheet-input.component';

describe('SheetInputComponent', () => {
  let component: SheetInputComponent;
  let fixture: ComponentFixture<SheetInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
