import { TestBed, inject } from '@angular/core/testing';

import { RoomPasswordFormService } from './room-password-form.service';

describe('RoomPasswordFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomPasswordFormService]
    });
  });

  it('should be created', inject([RoomPasswordFormService], (service: RoomPasswordFormService) => {
    expect(service).toBeTruthy();
  }));
});
