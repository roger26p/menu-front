import { TestBed } from '@angular/core/testing';

import { ConectionService } from './conection.service';

describe('ConectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConectionService = TestBed.get(ConectionService);
    expect(service).toBeTruthy();
  });
});
