import { TestBed } from '@angular/core/testing';

import { DepManager.ServiceService } from './dep-manager.service.service';

describe('DepManager.ServiceService', () => {
  let service: DepManager.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepManager.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
