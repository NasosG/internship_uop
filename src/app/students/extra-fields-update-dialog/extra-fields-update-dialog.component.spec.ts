import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFieldsUpdateDialogComponent } from './extra-fields-update-dialog.component';

describe('ExtraFieldsUpdateDialogComponent', () => {
  let component: ExtraFieldsUpdateDialogComponent;
  let fixture: ComponentFixture<ExtraFieldsUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraFieldsUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraFieldsUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
