import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'hv-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar scrollbar-thin">
      <div class="brand">
        <span class="brand-mark">🐝</span>
        <span class="brand-name">Hive</span>
      </div>

      <nav>
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            class="nav-link"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: sticky;
      top: 0;
      border-right: 1px solid var(--color-border);
      background: var(--color-surface);
      padding: 20px 16px;
      overflow-y: auto;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px 24px;
    }
    .brand-mark { font-size: 26px; }
    .brand-name {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: var(--color-heading);
    }
    nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      font-weight: 500;
      font-size: 14.5px;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .nav-link:hover {
      background: var(--color-surface-hover);
      color: var(--color-heading);
    }
    .nav-link.active {
      background: rgba(244, 180, 0, 0.14);
      color: var(--color-primary-hover);
      font-weight: 600;
    }
    .nav-icon { font-size: 18px; width: 22px; text-align: center; }

    @media (max-width: 900px) {
      .sidebar { display: none; }
    }
  `],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'My Communities', icon: '👥', path: '/communities/mine' },
    { label: 'Notifications', icon: '🔔', path: '/notifications' },
    { label: 'Profile', icon: '👤', path: '/profile' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
  ];
}
