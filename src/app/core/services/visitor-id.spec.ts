import { TestBed } from '@angular/core/testing';
import { VisitorId } from './visitor-id';

describe('VisitorId', () => {
  let service: VisitorId;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitorId);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
