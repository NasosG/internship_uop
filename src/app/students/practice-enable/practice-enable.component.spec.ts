import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeEnableComponent } from './practice-enable.component';

describe('PracticeEnableComponent', () => {
  let component: PracticeEnableComponent;
  let fixture: ComponentFixture<PracticeEnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeEnableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
