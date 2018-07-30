import { TestBed, inject } from '@angular/core/testing';

import { JumpingServiceService } from './jumping-service.service';

describe('JumpingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JumpingServiceService]
    });
  });

  it('should be created', inject([JumpingServiceService], (service: JumpingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
