import {
  Component,
  HostListener,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss'
})
export class NotificationCenter {

  private readonly notificationService =
    inject(NotificationService);

  isOpen = signal(false);
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  isLoading = signal(false);

  toggle(): void {
    this.isOpen.update(open => !open);

    if (this.isOpen()) {
      this.loadNotifications();
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  loadNotifications(): void {
    this.isLoading.set(true);

    this.notificationService
      .getNotifications()
      .subscribe({
        next: notifications => {
          this.notifications.set(notifications);
          this.unreadCount.set(
            notifications.filter(x => !x.isRead).length
          );
          this.isLoading.set(false);
        },
        error: error => {
          console.error(
            'Unable to load notifications:',
            error
          );
          this.isLoading.set(false);
        }
      });
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({
        next: updated => {
          this.notifications.update(items =>
            items.map(item =>
              item.id === updated.id
                ? updated
                : item
            )
          );

          this.unreadCount.update(count =>
            Math.max(0, count - 1)
          );
        },
        error: error => {
          console.error(
            'Unable to mark notification as read:',
            error
          );
        }
      });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0) {
      return;
    }

    this.notificationService
      .markAllAsRead()
      .subscribe({
        next: () => {
          this.notifications.update(items =>
            items.map(item => ({
              ...item,
              isRead: true,
              readAt: new Date().toISOString()
            }))
          );

          this.unreadCount.set(0);
        },
        error: error => {
          console.error(
            'Unable to mark notifications as read:',
            error
          );
        }
      });
  }

  deleteNotification(notification: Notification): void {
    this.notificationService
      .deleteNotification(notification.id)
      .subscribe({
        next: () => {
          this.notifications.update(items =>
            items.filter(
              item => item.id !== notification.id
            )
          );

          if (!notification.isRead) {
            this.unreadCount.update(count =>
              Math.max(0, count - 1)
            );
          }
        },
        error: error => {
          console.error(
            'Unable to delete notification:',
            error
          );
        }
      });
  }

  formatDate(date: string): string {
    const value = new Date(date);

    return value.toLocaleDateString(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  formatTime(date: string): string {
    const value = new Date(date);

    return value.toLocaleTimeString(
      'en-ZA',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  getIconType(notification: Notification): string {
    return notification.type.toLowerCase();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}