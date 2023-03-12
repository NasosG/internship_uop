import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFilesUploadComponent } from './contract-files-upload.component';

describe('ContractFilesUploadComponent', () => {
  let component: ContractFilesUploadComponent;
  let fixture: ComponentFixture<ContractFilesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractFilesUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractFilesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
