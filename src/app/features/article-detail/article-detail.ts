import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Icon, IconName } from '../../shared/icon/icon';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Icon
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);

  readonly article = signal<Article | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.error.set('Article could not be found.');
      this.loading.set(false);
      return;
    }

    this.loadArticle(slug);
  }

  private loadArticle(slug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.articleService.getArticleBySlug(slug).subscribe({
      next: (article) => {
        this.article.set(article);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load article:', error);

        this.error.set(
          'We could not find this article.'
        );

        this.loading.set(false);
      }
    });
  }

  getArticleIcon(icon: string | null | undefined): IconName {
    const validIcons: IconName[] = [
      'heart',
      'baby',
      'calendar',
      'screening',
      'ultrasound',
      'fertility',
      'wellness',
      'shield',
      'spark',
      'arrow-right',
      'phone',
      'mail',
      'location',
      'check',
      'menu',
      'close',
      'instagram',
      'facebook',
      'whatsapp'
    ];

    if (icon && validIcons.includes(icon as IconName)) {
      return icon as IconName;
    }

    return 'heart';
  }
}