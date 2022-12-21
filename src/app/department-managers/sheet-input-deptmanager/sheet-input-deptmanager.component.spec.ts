import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInputDeptmanagerComponent } from './sheet-input-deptmanager.component';

describe('SheetInputDeptmanagerComponent', () => {
  let component: SheetInputDeptmanagerComponent;
  let fixture: ComponentFixture<SheetInputDeptmanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetInputDeptmanagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInputDeptmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
