import { TestBed } from '@angular/core/testing';
import { ClinicSettingsService } from './clinic-settings.service';

describe('ClinicSettingsService', () => {
  let service: ClinicSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
