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

@Injectable({
    providedIn: 'root'
})
export class EmailSubscriberService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/email-subscribers';

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
}