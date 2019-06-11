import { TestBed } from '@angular/core/testing';

import { SeatTypesService } from './seat-types.service';

describe('SeatTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeatTypesService = TestBed.get(SeatTypesService);
    expect(service).toBeTruthy();
  });
});
