import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionUploadComponent } from './position-upload.component';

describe('PositionUploadComponent', () => {
  let component: PositionUploadComponent;
  let fixture: ComponentFixture<PositionUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
