import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsUploadedDisplayComponent } from './positions-uploaded-display.component';

describe('PositionsUploadedDisplayComponent', () => {
  let component: PositionsUploadedDisplayComponent;
  let fixture: ComponentFixture<PositionsUploadedDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionsUploadedDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsUploadedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
