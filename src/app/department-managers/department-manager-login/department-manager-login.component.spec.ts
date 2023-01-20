import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagerLoginComponent } from './department-manager-login.component';

describe('DepartmentManagerLoginComponent', () => {
  let component: DepartmentManagerLoginComponent;
  let fixture: ComponentFixture<DepartmentManagerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentManagerLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentManagerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
