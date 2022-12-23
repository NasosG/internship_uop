import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputOfficeDialogComponent } from './sheet-input-office-dialog.component';

describe('SheetInputOfficeDialogComponent', () => {
  let component: SheetInputOfficeDialogComponent;
  let fixture: ComponentFixture<SheetInputOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputOfficeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
