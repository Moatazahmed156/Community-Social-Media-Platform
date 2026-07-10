import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hv-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <span>🏠</span><small>Home</small>
      </a>
      <a routerLink="/notifications" routerLinkActive="active">
        <span>🔔</span><small>Alerts</small>
      </a>
      <a routerLink="/profile" routerLinkActive="active">
        <span>👤</span><small>Profile</small>
      </a>
      <a routerLink="/settings" routerLinkActive="active">
        <span>⚙️</span><small>Settings</small>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: none;
    }
    @media (max-width: 900px) {
      .bottom-nav {
        display: flex;
        position: fixed;
        bottom: 0; left: 0; right: 0;
        background: var(--color-surface);
        border-top: 1px solid var(--color-border);
        justify-content: space-around;
        padding: 8px 0 max(8px, env(safe-area-inset-bottom));
        z-index: 900;
      }
      .bottom-nav a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        color: var(--color-text-secondary);
        font-size: 10.5px;
        padding: 4px 10px;
        border-radius: var(--radius-sm);
      }
      .bottom-nav a span { font-size: 19px; }
      .bottom-nav a.active { color: var(--color-primary-hover); }
    }
  `],
})
export class BottomNavComponent {}
