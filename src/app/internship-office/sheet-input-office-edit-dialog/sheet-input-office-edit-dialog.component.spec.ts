import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputOfficeEditDialogComponent } from './sheet-input-office-edit-dialog.component';

describe('SheetInputOfficeEditDialogComponent', () => {
  let component: SheetInputOfficeEditDialogComponent;
  let fixture: ComponentFixture<SheetInputOfficeEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputOfficeEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputOfficeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
