import { TestBed } from '@angular/core/testing';

import { DetailService } from './olympic.service';

describe('DetailService', () => {
  let service: DetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
