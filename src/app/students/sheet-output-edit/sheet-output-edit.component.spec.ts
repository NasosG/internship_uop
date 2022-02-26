import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputEditComponent } from './sheet-output-edit.component';

describe('SheetOutputEditComponent', () => {
  let component: SheetOutputEditComponent;
  let fixture: ComponentFixture<SheetOutputEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
