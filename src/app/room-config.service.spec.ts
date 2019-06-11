import { TestBed } from '@angular/core/testing';

import { RoomConfigService } from './room-config.service';

describe('RoomConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomConfigService = TestBed.get(RoomConfigService);
    expect(service).toBeTruthy();
  });
});
