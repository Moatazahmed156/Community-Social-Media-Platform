import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  unreadCount = signal(0);

  constructor(private http: HttpClient) {}

  list(unreadOnly = false, page = 1, limit = 20) {
    return this.http
      .get<{ notifications: AppNotification[]; total: number; unreadCount: number }>(this.apiUrl, {
        params: { unreadOnly: String(unreadOnly), page, limit },
      })
      .pipe(tap((res) => this.unreadCount.set(res.unreadCount)));
  }

  markAsRead(id: string) {
    return this.http
      .patch<{ notification: AppNotification }>(`${this.apiUrl}/${id}/read`, {})
      .pipe(tap(() => this.unreadCount.update((c) => Math.max(0, c - 1))));
  }

  markAllAsRead() {
    return this.http
      .patch<{ message: string }>(`${this.apiUrl}/read-all`, {})
      .pipe(tap(() => this.unreadCount.set(0)));
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
