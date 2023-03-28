import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAndPositionInfoDialogComponent } from './company-and-position-info-dialog.component';

describe('CompanyAndPositionInfoDialogComponent', () => {
  let component: CompanyAndPositionInfoDialogComponent;
  let fixture: ComponentFixture<CompanyAndPositionInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAndPositionInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAndPositionInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
