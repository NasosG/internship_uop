import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsContractsNavMenuComponent } from './sheets-contracts-nav-menu.component';

describe('SheetsContractsNavMenuComponent', () => {
  let component: SheetsContractsNavMenuComponent;
  let fixture: ComponentFixture<SheetsContractsNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetsContractsNavMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetsContractsNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
