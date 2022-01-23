import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagerHeaderComponent } from './department-manager-header.component';

describe('DepartmentManagerHeaderComponent', () => {
  let component: DepartmentManagerHeaderComponent;
  let fixture: ComponentFixture<DepartmentManagerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentManagerHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
