import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AnalyticsSummary,
  ArticleAnalytics,
  VisitsTrend
} from '../../../core/models/analytics.model';

import { AnalyticsService } from '../../../core/services/analytics';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrl: './analytics.scss',
  templateUrl: './analytics.html',
})
export class Analytics implements OnInit {

  private readonly analyticsService = inject(AnalyticsService);

  readonly summary = signal<AnalyticsSummary | null>(null);
  readonly articles = signal<ArticleAnalytics[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly visitsTrend = signal<VisitsTrend[]>([]);
  readonly trendDays = signal(30);
  readonly trendLoading = signal(false);

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadVisitsTrend();
  }

  private loadAnalytics(): void {
    this.loading.set(true);
    this.error.set(null);

    this.analyticsService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loadArticleAnalytics();
      },
      error: (error) => {
        console.error(
          'Failed to load analytics summary:',
          error
        );

        this.error.set(
          'We could not load the analytics data.'
        );

        this.loading.set(false);
      }
    });
  }

  private loadArticleAnalytics(): void {
    this.analyticsService.getArticleAnalytics().subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(
          'Failed to load article analytics:',
          error
        );

        this.error.set(
          'We could not load article analytics.'
        );

        this.loading.set(false);
      }
    });
  }

  private loadVisitsTrend(): void {
    this.trendLoading.set(true);

    this.analyticsService.getVisitsTrend(this.trendDays()).subscribe({
      next: (trend) => {
        this.visitsTrend.set(trend);
        this.trendLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load visitor trend:', error);
        this.trendLoading.set(false);
      }
    });
  }

  setTrendDays(days: number): void {
    this.trendDays.set(days);
    this.loadVisitsTrend();
  }

  getMaxVisits(): number {
    return Math.max(
      ...this.visitsTrend().map(x => x.visits),
      1
    );
  }

  getVisitBarHeight(visits: number): number {
    if (visits <= 0) {
      return 2;
    }

    return Math.max(
      (visits / this.getMaxVisits()) * 100,
      4
    );
  }

  getMaxUniqueVisitors(): number {
    return Math.max(
      ...this.visitsTrend().map(x => x.uniqueVisitors),
      1
    );
  }

  getUniqueVisitorY(uniqueVisitors: number): number {
    const maxUniqueVisitors = this.getMaxUniqueVisitors();

    const chartTop = 12;
    const chartHeight = 180;

    return chartTop + chartHeight - (
      (uniqueVisitors / maxUniqueVisitors) * chartHeight
    );
  }

  getUniqueVisitorPoints(): string {
    const trend = this.visitsTrend();

    if (trend.length === 0) {
      return '';
    }

    const chartLeft = 20;
    const chartWidth = 960;

    return trend
      .map((item, index) => {
        const x = trend.length === 1
          ? 500
          : chartLeft + (
            index / (trend.length - 1)
          ) * chartWidth;

        const y = this.getUniqueVisitorY(item.uniqueVisitors);

        return `${x},${y}`;
      })
      .join(' ');
  }

  shouldShowTrendDate(index: number): boolean {
    const total = this.visitsTrend().length;

    if (total <= 7) {
      return true;
    }

    const step = Math.ceil((total - 1) / 6);

    return index % step === 0 || index === total - 1;
  }

  getShareCount(platform: string): number {
    return this.summary()
      ?.sharesByPlatform
      .find(x => x.platform === platform)
      ?.count ?? 0;
  }
}