import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputOfficeEditDialogComponent } from './sheet-output-office-edit-dialog.component';

describe('SheetOutputOfficeEditDialogComponent', () => {
  let component: SheetOutputOfficeEditDialogComponent;
  let fixture: ComponentFixture<SheetOutputOfficeEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputOfficeEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputOfficeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
