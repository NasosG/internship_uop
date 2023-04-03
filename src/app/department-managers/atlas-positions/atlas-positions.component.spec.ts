import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPositionsComponent } from './atlas-positions.component';

describe('AtlasPositionsComponent', () => {
  let component: AtlasPositionsComponent;
  let fixture: ComponentFixture<AtlasPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtlasPositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
