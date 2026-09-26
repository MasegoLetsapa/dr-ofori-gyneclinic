import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Icon, IconName } from '../../shared/icon/icon';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics';
import { VisitorIdService } from '../../core/services/visitor-id';

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

  constructor(
    private readonly seoService: SeoService,
    private readonly analyticsService: AnalyticsService,
    private readonly visitorIdService: VisitorIdService
  ) { }

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

        this.analyticsService.trackArticleView(
          article.id,
          this.visitorIdService.getVisitorId()
        );

        const title =
          `${article.title} | Dr. Ofori Gyne Clinic`;

        const description =
          article.excerpt?.trim() ||
          'Read women\'s health information and resources from Dr. Ofori Gyne Clinic.';

        const url =
          `https://www.gyneclinic.org.za/resources/${article.slug}`;

        const image = article.featuredMediaType === 'image'
          ? article.featuredImage ?? undefined
          : undefined;

        this.seoService.updateSeo(
          title,
          description,
          url,
          image,
          'article'
        );

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Failed to load article:',
          error
        );

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

  readonly copied = signal(false);

  shareWhatsApp(): void {
    const article = this.article();

    if (!article) {
      return;
    }

    const url = this.getArticleUrl();
    const text = `${article.title} — ${url}`;

    const shareWindow = window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );

    if (shareWindow) {
      this.trackArticleShare('whatsapp');
    }
  }

  shareFacebook(): void {
    const article = this.article();

    if (!article) {
      return;
    }

    const url = this.getArticleUrl();

    const shareWindow = window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );

    if (shareWindow) {
      this.trackArticleShare('facebook');
    }
  }

  shareX(): void {
    const article = this.article();

    if (!article) {
      return;
    }

    const url = this.getArticleUrl();
    const text = article.title;

    const shareWindow = window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );

    if (shareWindow) {
      this.trackArticleShare('x');
    }
  }

  async copyLink(): Promise<void> {
    const url = this.getArticleUrl();

    try {
      await navigator.clipboard.writeText(url);

      this.copied.set(true);

      this.trackArticleShare('copy-link');

      setTimeout(() => {
        this.copied.set(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to copy article link:', error);
    }
  }

  async nativeShare(): Promise<void> {
    const article = this.article();

    if (!article || !navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title: article.title,
        text: article.excerpt || article.title,
        url: this.getArticleUrl()
      });

      this.trackArticleShare('native-share');

    } catch (error) {
      // User cancelling the native share dialog is not an error we need to show.
    }
  }

  canNativeShare(): boolean {
    return typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function';
  }

  private trackArticleShare(platform: string): void {
    const article = this.article();

    if (!article) {
      return;
    }

    this.analyticsService.trackArticleShare(
      article.id,
      platform,
      this.visitorIdService.getVisitorId()
    );
  }

  private getArticleUrl(): string {
    return window.location.href;
  }
}