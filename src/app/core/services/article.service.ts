import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private readonly http = inject(HttpClient);

    /* private readonly apiUrl =
        'https://letsapamasego-001-site1.ltempurl.com/api/articles';
 */

    private readonly apiUrl =
        `${environment.apiUrl}/articles`;


    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(this.apiUrl);
    }

    getArticleBySlug(slug: string): Observable<Article> {
        return this.http.get<Article>(
            `${this.apiUrl}/${slug}`
        );
    }
}