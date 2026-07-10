import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hv-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="overlay" (click)="cancel.emit()">
        <div class="dialog card fade-in" (click)="$event.stopPropagation()">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="actions">
            <button class="btn btn-secondary" (click)="cancel.emit()">{{ cancelLabel }}</button>
            <button class="btn" [class.btn-danger]="danger" [class.btn-primary]="!danger" (click)="confirm.emit()">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0; background: rgba(15, 17, 22, 0.45);
      display: flex; align-items: center; justify-content: center; z-index: 1500; padding: 16px;
    }
    .dialog { max-width: 400px; width: 100%; }
    p { color: var(--color-text-secondary); font-size: 14px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `],
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() danger = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
