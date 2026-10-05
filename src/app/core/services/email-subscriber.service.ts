import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailSubscriberResponse {
    subscribed: boolean;
    message: string;
}

export interface SendArticleUpdateResponse {
    message: string;
    articleId: number;
    sent: number;
    failed: number;
}

export interface EmailSubscriber {
    id: number;
    email: string;
    sourceArticleId: number | null;
    subscribedAt: string;
    isActive: boolean;
}

export interface ArticleDistribution {
    id: number;
    articleId: number;
    articleTitle: string;
    articleSlug: string;
    sentAt: string;
    sentCount: number;
    failedCount: number;
    sentBy: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class EmailSubscriberService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/email-subscribers';

    subscribe(
        email: string,
        sourceArticleId?: number
    ): Observable<EmailSubscriberResponse> {
        return this.http.post<EmailSubscriberResponse>(
            this.apiUrl,
            {
                email,
                sourceArticleId
            }
        );
    }

    sendArticleUpdate(
        articleId: number
    ): Observable<SendArticleUpdateResponse> {
        return this.http.post<SendArticleUpdateResponse>(
            `${this.apiUrl}/send-article`,
            {
                articleId
            }
        );
    }

    getSubscribers(): Observable<EmailSubscriber[]> {
        return this.http.get<EmailSubscriber[]>(
            this.apiUrl
        );
    }

    unsubscribeSubscriber(
        id: number
    ): Observable<{ message: string; subscriberId: number; isActive: boolean }> {

        return this.http.delete<{
            message: string;
            subscriberId: number;
            isActive: boolean;
        }>(
            `${this.apiUrl}/${id}`
        );
    }


    reactivateSubscriber(
        id: number
    ): Observable<{ message: string; subscriberId: number; isActive: boolean }> {

        return this.http.patch<{
            message: string;
            subscriberId: number;
            isActive: boolean;
        }>(
            `${this.apiUrl}/${id}/reactivate`,
            {}
        );
    }

    getArticleDistributionHistory():
        Observable<ArticleDistribution[]> {

        return this.http.get<ArticleDistribution[]>(
            `${this.apiUrl}/article-history`
        );
    }


}