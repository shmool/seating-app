import { TestBed } from '@angular/core/testing';

import { SelectSeatsService } from './select-seats.service';

describe('SelectSeatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectSeatsService = TestBed.get(SelectSeatsService);
    expect(service).toBeTruthy();
  });
});
