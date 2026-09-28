import { TestBed } from '@angular/core/testing';
import { GeoLocationServiceService } from './geo-location-service.service';

describe('GeoLocationServiceService', () => {
  let service: GeoLocationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoLocationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
