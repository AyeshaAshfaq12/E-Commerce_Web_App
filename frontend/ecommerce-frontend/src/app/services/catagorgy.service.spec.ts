import { TestBed } from '@angular/core/testing';

import { CatagorgyService } from './catagorgy.service';

describe('CatagorgyService', () => {
  let service: CatagorgyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatagorgyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
