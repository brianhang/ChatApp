import { TestBed, inject } from '@angular/core/testing';

import { BanService } from './ban.service';

describe('BanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BanService]
    });
  });

  it('should be created', inject([BanService], (service: BanService) => {
    expect(service).toBeTruthy();
  }));
});
