import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification, NotificationType } from '../../core/models/notification.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

const ICONS: Record<NotificationType, string> = {
  postApproved: '✅',
  postRejected: '🚫',
  comment: '💬',
  reaction: '❤️',
  announcement: '📢',
};

@Component({
  selector: 'hv-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent, TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: AppNotification[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.notificationService.list(false, 1, 50).subscribe({
      next: (res) => {
        this.notifications = res.notifications;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  icon(type: NotificationType): string {
    return ICONS[type] ?? '🔔';
  }

  markAsRead(n: AppNotification): void {
    if (n.isRead) return;
    this.notificationService.markAsRead(n._id).subscribe({
      next: () => (n.isRead = true),
      error: () => {},
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => this.notifications.forEach((n) => (n.isRead = true)),
      error: () => {},
    });
  }

  remove(n: AppNotification): void {
    this.notificationService.delete(n._id).subscribe({
      next: () => (this.notifications = this.notifications.filter((x) => x._id !== n._id)),
      error: () => {},
    });
  }
}
