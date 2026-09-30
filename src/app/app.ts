import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './core/services/analytics';
import { VisitorIdService } from './core/services/visitor-id';
import { TrafficSourceService } from './core/services/traffic-source.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {

  private readonly router = inject(Router);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly visitorIdService = inject(VisitorIdService);

  protected readonly title = signal('dr-ofori-gyneclinic');
  private readonly trafficSourceService = inject(TrafficSourceService);

  constructor() {

    const visitorId = this.visitorIdService.getVisitorId();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        const rawPath = event.urlAfterRedirects;

        if (rawPath.startsWith('/admin')) {
          return;
        }

        const path = rawPath.split('?')[0].split('#')[0] || '/';

        const trafficData = this.trafficSourceService.getTrafficData();

        this.analyticsService.trackVisit(
          path,
          visitorId,
          this.getDeviceType(),
          trafficData.sessionId,
          trafficData.trafficSource,
          trafficData.trafficMedium,
          trafficData.trafficCampaign
        );

      });
  }

  private getDeviceType(): string {
    const width = window.innerWidth;

    if (width < 768) {
      return 'mobile';
    }

    if (width < 1024) {
      return 'tablet';
    }

    return 'desktop';
  }
}