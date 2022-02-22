import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputEditComponent } from './sheet-input-edit.component';

describe('SheetInputEditComponent', () => {
  let component: SheetInputEditComponent;
  let fixture: ComponentFixture<SheetInputEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
