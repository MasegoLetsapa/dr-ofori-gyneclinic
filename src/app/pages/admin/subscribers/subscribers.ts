import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  EmailSubscriber,
  EmailSubscriberService
} from '../../../core/services/email-subscriber.service';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscribers.html'
})
export class Subscribers implements OnInit {

  private readonly subscriberService =
    inject(EmailSubscriberService);

  readonly subscribers =
    signal<EmailSubscriber[]>([]);

  readonly actionLoading =
    signal<number | null>(null);

  readonly actionMessage =
    signal<string | null>(null);

  readonly pendingSubscriber =
    signal<EmailSubscriber | null>(null);

  readonly pendingAction =
    signal<'unsubscribe' | 'reactivate' | null>(null);

  readonly loading =
    signal(false);

  readonly error =
    signal<string | null>(null);


  readonly totalSubscribers =
    signal(0);

  readonly activeSubscribers =
    signal(0);

  readonly inactiveSubscribers =
    signal(0);


  ngOnInit(): void {
    this.loadSubscribers();
  }


  loadSubscribers(): void {

    this.loading.set(true);
    this.error.set(null);

    this.subscriberService
      .getSubscribers()
      .subscribe({

        next: (subscribers) => {

          this.subscribers.set(
            subscribers
          );

          this.updateCounts();

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load subscribers:',
            error
          );

          this.error.set(
            error?.error?.message ||
            'Unable to load subscribers.'
          );

          this.loading.set(false);
        }
      });
  }

  unsubscribeSubscriber(
    subscriber: EmailSubscriber
  ): void {

    this.actionLoading.set(
      subscriber.id
    );

    this.actionMessage.set(null);

    this.subscriberService
      .unsubscribeSubscriber(subscriber.id)
      .subscribe({

        next: () => {

          this.actionLoading.set(null);

          this.actionMessage.set(
            `${subscriber.email} has been unsubscribed.`
          );

          this.loadSubscribers();
        },

        error: (error) => {

          console.error(
            'Failed to unsubscribe subscriber:',
            error
          );

          this.actionLoading.set(null);

          this.actionMessage.set(
            error?.error?.message ||
            'Unable to unsubscribe subscriber.'
          );
        }
      });
  }


  reactivateSubscriber(
    subscriber: EmailSubscriber
  ): void {

    this.actionLoading.set(
      subscriber.id
    );

    this.actionMessage.set(null);

    this.subscriberService
      .reactivateSubscriber(subscriber.id)
      .subscribe({

        next: () => {

          this.actionLoading.set(null);

          this.actionMessage.set(
            `${subscriber.email} has been reactivated.`
          );

          this.loadSubscribers();
        },

        error: (error) => {

          console.error(
            'Failed to reactivate subscriber:',
            error
          );

          this.actionLoading.set(null);

          this.actionMessage.set(
            error?.error?.message ||
            'Unable to reactivate subscriber.'
          );
        }
      });
  }


  requestUnsubscribe(
    subscriber: EmailSubscriber
  ): void {

    this.pendingSubscriber.set(subscriber);
    this.pendingAction.set('unsubscribe');
  }


  requestReactivate(
    subscriber: EmailSubscriber
  ): void {

    this.pendingSubscriber.set(subscriber);
    this.pendingAction.set('reactivate');
  }


  closeConfirmation(): void {

    this.pendingSubscriber.set(null);
    this.pendingAction.set(null);
  }


  confirmSubscriberAction(): void {

    const subscriber =
      this.pendingSubscriber();

    const action =
      this.pendingAction();

    if (!subscriber || !action) {
      return;
    }

    this.closeConfirmation();

    if (action === 'unsubscribe') {

      this.unsubscribeSubscriber(
        subscriber
      );

      return;
    }

    this.reactivateSubscriber(
      subscriber
    );
  }


  updateCounts(): void {

    const subscribers =
      this.subscribers();

    this.totalSubscribers.set(
      subscribers.length
    );

    this.activeSubscribers.set(
      subscribers.filter(
        subscriber => subscriber.isActive
      ).length
    );

    this.inactiveSubscribers.set(
      subscribers.filter(
        subscriber => !subscriber.isActive
      ).length
    );
  }
}