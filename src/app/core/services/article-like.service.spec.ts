import { TestBed } from '@angular/core/testing';
import { ArticleLikeService } from './article-like.service';

describe('ArticleLikeService', () => {
  let service: ArticleLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
