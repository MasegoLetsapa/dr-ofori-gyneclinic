import { TestBed } from '@angular/core/testing';
import { TrafficSourceService } from './traffic-source.service';

describe('TrafficSourceService', () => {
  let service: TrafficSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
