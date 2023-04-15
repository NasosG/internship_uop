import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsContractsNavMenuOfficeComponent } from './sheets-contracts-nav-menu-office.component';

describe('SheetsContractsNavMenuOfficeComponent', () => {
  let component: SheetsContractsNavMenuOfficeComponent;
  let fixture: ComponentFixture<SheetsContractsNavMenuOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetsContractsNavMenuOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetsContractsNavMenuOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
