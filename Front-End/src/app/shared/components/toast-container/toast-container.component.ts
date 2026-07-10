import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'hv-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast fade-in" [class]="'toast-' + toast.kind" (click)="toastService.dismiss(toast.id)">
          <span class="toast-dot"></span>
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      font-size: 13.5px;
      color: var(--color-heading);
      cursor: pointer;
    }
    .toast-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .toast-success .toast-dot { background: var(--color-success); }
    .toast-error .toast-dot { background: var(--color-danger); }
    .toast-info .toast-dot { background: var(--color-info); }
    @media (max-width: 640px) {
      .toast-stack { left: 12px; right: 12px; max-width: none; top: 12px; }
    }
  `],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
