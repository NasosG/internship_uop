import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UopLoadingScreenComponent } from './uop-loading-screen.component';

describe('UopLoadingScreenComponent', () => {
  let component: UopLoadingScreenComponent;
  let fixture: ComponentFixture<UopLoadingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UopLoadingScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UopLoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
