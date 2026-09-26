import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './core/services/analytics';
import { VisitorIdService } from './core/services/visitor-id';

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

        this.analyticsService.trackVisit(
          event.urlAfterRedirects,
          visitorId,
          this.getDeviceType()
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