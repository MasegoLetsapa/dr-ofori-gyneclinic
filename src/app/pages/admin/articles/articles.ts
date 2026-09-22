import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { AdminArticleService } from '../../../core/services/admin-article.service';

import { Article } from '../../../core/models/article.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './articles.html',
  styleUrl: './articles.scss'
})
export class Articles implements OnInit {

  private readonly articleService =
    inject(AdminArticleService);

  private readonly router = inject(Router);

  // ========================================
  // STATE
  // ========================================

  articles = signal<Article[]>([]);

  loading = signal(false);

  error = signal<string | null>(null);

  searchTerm = signal('');

  selectedStatus = signal('All');


  // ========================================
  // FILTERED ARTICLES
  // ========================================

  filteredArticles = computed(() => {

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    const status =
      this.selectedStatus();

    return this.articles().filter(article => {

      const matchesSearch =
        !search ||
        article.title.toLowerCase().includes(search) ||
        article.slug.toLowerCase().includes(search) ||
        (article.category ?? '')
          .toLowerCase()
          .includes(search) ||
        (article.author ?? '')
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === 'All' ||
        (status === 'Published' && article.isPublished) ||
        (status === 'Draft' && !article.isPublished);

      return matchesSearch && matchesStatus;
    });

  });


  // ========================================
  // COUNTS
  // ========================================

  totalArticles = computed(() =>
    this.articles().length
  );

  publishedArticles = computed(() =>
    this.articles().filter(
      article => article.isPublished
    ).length
  );

  draftArticles = computed(() =>
    this.articles().filter(
      article => !article.isPublished
    ).length
  );


  // ========================================
  // INITIALIZE
  // ========================================

  ngOnInit(): void {

    this.loadArticles();

  }


  // ========================================
  // LOAD ARTICLES
  // ========================================

  loadArticles(): void {

    this.loading.set(true);

    this.error.set(null);

    this.articleService
      .getArticles()
      .subscribe({

        next: articles => {

          this.articles.set(articles);

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'Failed to load articles:',
            error
          );

          this.error.set(
            'Unable to load articles. Please try again.'
          );

          this.loading.set(false);

        }

      });

  }

  // ========================================
  // CREATE ARTICLE
  // ========================================

  createArticle(): void {
    this.router.navigate(['/admin/articles/new']);
  }

  // ========================================
  // EDIT ARTICLE
  // ========================================

  editArticle(id: number): void {
    this.router.navigate(['/admin/articles', id, 'edit']);
  }


  // ========================================
  // REFRESH
  // ========================================

  refreshArticles(): void {

    this.loadArticles();

  }


  // ========================================
  // SEARCH
  // ========================================

  setSearchTerm(value: string): void {

    this.searchTerm.set(value);

  }


  // ========================================
  // STATUS FILTER
  // ========================================

  setStatus(value: string): void {

    this.selectedStatus.set(value);

  }


  // ========================================
  // PUBLISH / UNPUBLISH
  // ========================================

  togglePublished(article: Article): void {

    if (article.isPublished) {

      this.articleService
        .unpublishArticle(article.id)
        .subscribe({

          next: () => {

            this.loadArticles();

          },

          error: error => {

            console.error(
              'Failed to unpublish article:',
              error
            );

            this.error.set(
              'Unable to unpublish the article.'
            );

          }

        });

      return;
    }


    this.articleService
      .publishArticle(article.id)
      .subscribe({

        next: () => {

          this.loadArticles();

        },

        error: error => {

          console.error(
            'Failed to publish article:',
            error
          );

          this.error.set(
            'Unable to publish the article.'
          );

        }

      });

  }

}