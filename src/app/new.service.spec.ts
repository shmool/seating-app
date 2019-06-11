import { TestBed } from '@angular/core/testing';

import { NewService } from './new.service';

describe('NewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewService = TestBed.get(NewService);
    expect(service).toBeTruthy();
  });
});
