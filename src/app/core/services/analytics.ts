import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnalyticsSummary, ArticleAnalytics, VisitsTrend } from '../models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/analytics`;

    trackVisit(
        pagePath: string,
        visitorId: string,
        deviceType?: string
    ): void {

        this.http.post(`${this.apiUrl}/visit`, {
            pagePath,
            visitorId,
            deviceType
        }).subscribe({
            error: (error) => {
                console.error('Analytics tracking failed:', error);
            }
        });
    }

    trackArticleView(
        articleId: number,
        visitorId: string
    ): void {

        this.http.post(`${this.apiUrl}/article-view`, {
            articleId,
            visitorId
        }).subscribe({
            error: (error) => {
                console.error('Article view tracking failed:', error);
            }
        });
    }

    trackArticleShare(
        articleId: number,
        platform: string,
        visitorId: string
    ): void {

        this.http.post(`${this.apiUrl}/article-share`, {
            articleId,
            platform,
            visitorId
        }).subscribe({
            error: (error) => {
                console.error('Article share tracking failed:', error);
            }
        });
    }

    getSummary() {
        return this.http.get<AnalyticsSummary>(
            `${this.apiUrl}/admin/summary`
        );
    }

    getArticleAnalytics() {
        return this.http.get<ArticleAnalytics[]>(
            `${this.apiUrl}/admin/articles`
        );
    }

    getVisitsTrend(days: number = 30) {
        return this.http.get<VisitsTrend[]>(
            `${this.apiUrl}/admin/visits-trend?days=${days}`
        );
    }
}