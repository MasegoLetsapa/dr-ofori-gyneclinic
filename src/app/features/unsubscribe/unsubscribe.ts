import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  templateUrl: './unsubscribe.html'
})
export class Unsubscribe implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);
  readonly success = signal(false);
  readonly message = signal('');

  private readonly apiUrl =
    'https://localhost:7003/api/email-subscribers';

  ngOnInit(): void {
    const token =
      this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading.set(false);
      this.message.set(
        'This unsubscribe link is invalid.'
      );
      return;
    }

    this.unsubscribe(token);
  }

  private unsubscribe(token: string): void {
    this.http
      .get<{ message: string }>(
        `${this.apiUrl}/unsubscribe/${encodeURIComponent(token)}`
      )
      .subscribe({
        next: (response) => {
          this.success.set(true);
          this.message.set(response.message);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(
            'Unsubscribe failed:',
            error
          );

          this.success.set(false);
          this.message.set(
            error?.error?.message ??
            'We could not process your unsubscribe request. Please try again.'
          );

          this.loading.set(false);
        }
      });
  }
}