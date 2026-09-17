import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Notification } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/notifications';

    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.apiUrl);
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/unread-count`
        );
    }

    markAsRead(id: number): Observable<Notification> {
        return this.http.put<Notification>(
            `${this.apiUrl}/${id}/read`,
            {}
        );
    }

    markAllAsRead(): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/read-all`,
            {}
        );
    }

    deleteNotification(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}