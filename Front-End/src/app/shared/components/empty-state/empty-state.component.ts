import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hv-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty">
      <div class="empty-icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
      <p>{{ subtitle }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty {
      text-align: center;
      padding: 48px 20px;
      color: var(--color-text-secondary);
    }
    .empty-icon { font-size: 40px; margin-bottom: 12px; }
    h3 { margin-bottom: 6px; }
    p { margin: 0 0 16px; font-size: 14px; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = '🐝';
  @Input() title = 'Nothing here yet';
  @Input() subtitle = '';
}
