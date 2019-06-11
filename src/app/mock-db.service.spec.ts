import { TestBed } from '@angular/core/testing';

import { MockDbService } from './mock-db.service';

describe('MockDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockDbService = TestBed.get(MockDbService);
    expect(service).toBeTruthy();
  });
});
