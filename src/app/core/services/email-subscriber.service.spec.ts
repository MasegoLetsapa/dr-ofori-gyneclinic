import { TestBed } from '@angular/core/testing';
import { EmailSubscriberService } from './email-subscriber.service';

describe('EmailSubscriberService', () => {
  let service: EmailSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
