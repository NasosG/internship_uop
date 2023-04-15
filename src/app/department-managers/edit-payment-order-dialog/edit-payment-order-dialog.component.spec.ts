import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentOrderDialogComponent } from './edit-payment-order-dialog.component';

describe('EditPaymentOrderDialogComponent', () => {
  let component: EditPaymentOrderDialogComponent;
  let fixture: ComponentFixture<EditPaymentOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentOrderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
