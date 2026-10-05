import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArticleLikeResponse {
    liked: boolean;
    likeCount: number;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ArticleLikeService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/article-likes';

    getLikeStatus(
        articleId: number,
        visitorId: string
    ): Observable<ArticleLikeResponse> {
        return this.http.get<ArticleLikeResponse>(
            `${this.apiUrl}/${articleId}?visitorId=${encodeURIComponent(visitorId)}`
        );
    }

    likeArticle(
        articleId: number,
        visitorId: string
    ): Observable<ArticleLikeResponse> {
        return this.http.post<ArticleLikeResponse>(
            this.apiUrl,
            {
                articleId,
                visitorId
            }
        );
    }
}