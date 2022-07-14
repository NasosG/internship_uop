import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsAddComponent } from './positions-add.component';

describe('PositionsAddComponent', () => {
  let component: PositionsAddComponent;
  let fixture: ComponentFixture<PositionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
