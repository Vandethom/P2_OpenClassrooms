import { TestBed } from '@angular/core/testing';

import { CardFactoryService } from './card-factory.service';

describe('DetailService', () => {
  let service: CardFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
