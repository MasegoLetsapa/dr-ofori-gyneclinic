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
import { ArticleDistribution, EmailSubscriber, EmailSubscriberService } from '../../../core/services/email-subscriber.service';

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

  private readonly emailSubscriberService = inject(EmailSubscriberService);

  readonly sendModalOpen = signal(false);

  readonly selectedArticleForSend = signal<Article | null>(null);

  readonly activeSubscriberCount = signal(0);

  readonly sendingArticle = signal(false);

  readonly successMessage = signal<string | null>(null);

  readonly distributionHistory = signal<ArticleDistribution[]>([]);

  readonly distributionHistoryLoading = signal(false);

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
    this.loadDistributionHistory();

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

  loadDistributionHistory(): void {

    this.distributionHistoryLoading.set(true);

    this.emailSubscriberService
      .getArticleDistributionHistory()
      .subscribe({
        next: (history) => {

          this.distributionHistory.set(history);
          this.distributionHistoryLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load article distribution history:',
            error
          );

          this.distributionHistoryLoading.set(false);
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

  sendArticleToSubscribers(article: Article): void {

    if (!article.isPublished) {
      this.error.set(
        'Only published articles can be sent to subscribers.'
      );

      return;
    }

    this.error.set(null);

    this.selectedArticleForSend.set(article);
    this.sendModalOpen.set(true);

    this.emailSubscriberService
      .getSubscribers()
      .subscribe({
        next: (subscribers: EmailSubscriber[]) => {

          const activeCount =
            subscribers.filter(
              subscriber => subscriber.isActive
            ).length;

          this.activeSubscriberCount.set(activeCount);
        },

        error: (error) => {

          console.error(
            'Failed to load subscribers:',
            error
          );

          this.activeSubscriberCount.set(0);
        }
      });
  }

  closeSendModal(): void {
    if (this.sendingArticle()) {
      return;
    }

    this.sendModalOpen.set(false);
    this.selectedArticleForSend.set(null);
  }

  confirmSendArticle(): void {

    const article =
      this.selectedArticleForSend();

    if (!article) {
      return;
    }

    this.sendingArticle.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    this.emailSubscriberService
      .sendArticleUpdate(article.id)
      .subscribe({
        next: (response) => {

          this.sendingArticle.set(false);
          this.sendModalOpen.set(false);
          this.selectedArticleForSend.set(null);

          this.successMessage.set(
            `Article sent successfully. ${response.sent} sent, ${response.failed} failed.`
          );
        },

        error: (error) => {

          console.error(
            'Failed to send article to subscribers:',
            error
          );

          this.sendingArticle.set(false);

          this.error.set(
            error?.error?.message ||
            'Unable to send the article to subscribers.'
          );
        }
      });
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

  getLatestDistribution(
    articleId: number
  ): ArticleDistribution | null {

    return (
      this.distributionHistory()
        .find(
          distribution =>
            distribution.articleId === articleId
        ) ?? null
    );
  }

  resendArticleToSubscribers(article: Article): void {

    const distribution =
      this.getLatestDistribution(article.id);

    if (!distribution) {
      this.sendArticleToSubscribers(article);
      return;
    }

    const sentDate =
      new Date(distribution.sentAt)
        .toLocaleDateString(
          'en-ZA',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        );

    const confirmed =
      window.confirm(
        `This article was already sent on ${sentDate}.\n\n` +
        `${distribution.sentCount} subscriber(s) previously received it.\n\n` +
        `Resending will deliver another copy. Continue?`
      );

    if (!confirmed) {
      return;
    }

    this.sendingArticle.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    this.emailSubscriberService
      .sendArticleUpdate(article.id)
      .subscribe({
        next: (response) => {

          this.sendingArticle.set(false);

          this.successMessage.set(
            `Article resent successfully. ` +
            `${response.sent} sent, ` +
            `${response.failed} failed.`
          );

          this.loadDistributionHistory();
        },

        error: (error) => {

          console.error(
            'Failed to resend article:',
            error
          );

          this.sendingArticle.set(false);

          this.error.set(
            error?.error?.message ||
            'Unable to resend the article.'
          );
        }
      });
  }

}