import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetOutputDeptmanagerComponent } from './sheet-output-deptmanager.component';

describe('SheetOutputDeptmanagerComponent', () => {
  let component: SheetOutputDeptmanagerComponent;
  let fixture: ComponentFixture<SheetOutputDeptmanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetOutputDeptmanagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetOutputDeptmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
