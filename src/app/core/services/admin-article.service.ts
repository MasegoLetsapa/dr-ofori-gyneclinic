import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Article,
    CreateArticleRequest,
    UpdateArticleRequest
} from '../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminArticleService {

    private readonly http = inject(HttpClient);

    /* private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/admin/articles'; */

    private readonly apiUrl =
        `${environment.apiUrl}/admin/articles`;

    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(
            this.apiUrl
        );
    }

    getArticle(id: number): Observable<Article> {
        return this.http.get<Article>(
            `${this.apiUrl}/${id}`
        );
    }

    createArticle(
        request: CreateArticleRequest
    ): Observable<Article> {
        return this.http.post<Article>(
            this.apiUrl,
            request
        );
    }

    updateArticle(
        id: number,
        request: UpdateArticleRequest
    ): Observable<Article> {
        return this.http.put<Article>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    publishArticle(
        id: number
    ): Observable<void> {
        return this.http.patch<void>(
            `${this.apiUrl}/${id}/publish`,
            {}
        );
    }

    unpublishArticle(
        id: number
    ): Observable<void> {
        return this.http.patch<void>(
            `${this.apiUrl}/${id}/unpublish`,
            {}
        );
    }
}