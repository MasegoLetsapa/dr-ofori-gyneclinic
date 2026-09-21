import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/articles';

    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(this.apiUrl);
    }

    getArticleBySlug(slug: string): Observable<Article> {
        return this.http.get<Article>(
            `${this.apiUrl}/${slug}`
        );
    }
}