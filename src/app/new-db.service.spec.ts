import { TestBed } from '@angular/core/testing';

import { NewDbService } from './new-db.service';

describe('NewDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewDbService = TestBed.get(NewDbService);
    expect(service).toBeTruthy();
  });
});
