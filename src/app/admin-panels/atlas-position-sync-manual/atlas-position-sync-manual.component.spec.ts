import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPositionSyncManualComponent } from './atlas-position-sync-manual.component';

describe('AtlasPositionSyncManualComponent', () => {
  let component: AtlasPositionSyncManualComponent;
  let fixture: ComponentFixture<AtlasPositionSyncManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtlasPositionSyncManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPositionSyncManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
