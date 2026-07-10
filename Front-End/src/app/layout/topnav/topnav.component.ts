import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'hv-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AvatarComponent],
  template: `
    <header class="topnav">
    
      <div class="actions">
      <div class="icons">
        <button class="btn btn-icon btn-ghost" (click)="theme.toggle()" title="Toggle theme">
          {{ theme.isDark() ? '☀️' : '🌙' }}
        </button>

        <a routerLink="/notifications" class="btn btn-icon btn-ghost notif-btn" title="Notifications">
          🔔
          @if (notifications.unreadCount() > 0) {
            <span class="badge-dot">{{ notifications.unreadCount() > 9 ? '9+' : notifications.unreadCount() }}</span>
          }
        </a>
</div>
        <div class="user-menu" (click)="toggleMenu($event)">
          <hv-avatar
            [src]="auth.currentUser()?.profilePicture"
            [firstName]="auth.currentUser()?.firstName || ''"
            [lastName]="auth.currentUser()?.lastName || ''"
            [size]="40"
          />
          @if (menuOpen) {
            <div class="dropdown fade-in" (click)="$event.stopPropagation()">
              <a routerLink="/profile" (click)="menuOpen = false">My Profile</a>
              <a routerLink="/settings" (click)="menuOpen = false">Settings</a>
              <button (click)="logout()">Log out</button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topnav {
      height: var(--topnav-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      position: sticky;
      top: 0;
      z-index: 800;
    }
    .actions { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 8px; }
    .notif-btn { position: relative; text-decoration: none; }
    .badge-dot {
      position: absolute;
      top: 2px; right: 2px;
      background: var(--color-danger);
      color: #fff;
      font-size: 9.5px;
      font-weight: 700;
      min-width: 16px;
      height: 16px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 3px;
    }
    .user-menu { position: relative; cursor: pointer; margin-left: 4px; }
    .dropdown {
      position: absolute;
      right: 0;
      top: 46px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-lg);
      min-width: 170px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      z-index: 1000;
    }
    .dropdown a, .dropdown button {
      text-align: left;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      color: var(--color-text);
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    .dropdown a:hover, .dropdown button:hover { background: var(--color-surface-hover); }
    .dropdown button { color: var(--color-danger); }

    @media (max-width: 640px) {
      .search-wrap { display: none; }
    }
  `],
})
export class TopnavComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  menuOpen = false;

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }


  logout(): void {
    this.menuOpen = false;
    this.auth.logout();
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.menuOpen = false;
  }
}
