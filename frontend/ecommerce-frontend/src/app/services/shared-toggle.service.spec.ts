import { TestBed } from '@angular/core/testing';

import { SharedToggleService } from './shared-toggle.service';

describe('SharedToggleService', () => {
  let service: SharedToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
