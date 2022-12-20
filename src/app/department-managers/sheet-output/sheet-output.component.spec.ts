import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputComponent } from './sheet-output.component';

describe('SheetOutputComponent', () => {
  let component: SheetOutputComponent;
  let fixture: ComponentFixture<SheetOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
