import { TestBed } from '@angular/core/testing';

import { DepManagerService } from './dep-manager.service';

describe('DepManager.Service', () => {
  let service: DepManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
