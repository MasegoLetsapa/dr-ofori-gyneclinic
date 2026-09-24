import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icon, IconName } from '../../shared/icon/icon';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { SocialFloat } from '../../shared/social-float/social-float';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Icon,
    SocialFloat
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources implements OnInit {

  private readonly articleService = inject(ArticleService);

  constructor(
    private readonly seoService: SeoService
  ) {

    this.seoService.updateSeo(
      'Women\'s Health Resources | Dr. Ofori Gyne Clinic',
      'Read helpful information about women\'s health, pregnancy, family planning, fertility, screening and wellbeing from Dr. Ofori Gyne Clinic.',
      'https://www.gyneclinic.org.za/resources'
    );

    // your existing code...
  }


  readonly articles = signal<Article[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load articles:', error);

        this.error.set(
          'We could not load the resources right now. Please try again later.'
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