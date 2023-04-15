import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersOfficeComponent } from './payment-orders-office.component';

describe('PaymentOrdersOfficeComponent', () => {
  let component: PaymentOrdersOfficeComponent;
  let fixture: ComponentFixture<PaymentOrdersOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOrdersOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOrdersOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
