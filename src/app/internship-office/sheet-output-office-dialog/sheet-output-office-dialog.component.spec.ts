import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputOfficeDialogComponent } from './sheet-output-office-dialog.component';

describe('SheetOutputOfficeDialogComponent', () => {
  let component: SheetOutputOfficeDialogComponent;
  let fixture: ComponentFixture<SheetOutputOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputOfficeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
