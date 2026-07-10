import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUrlPipe } from '../../pipes/file-url.pipe';
import { getInitials } from '../../utils/initials';

@Component({
  selector: 'hv-avatar',
  standalone: true,
  imports: [CommonModule, FileUrlPipe],
  template: `
    @if (src) {
      <img [src]="src | fileUrl" [alt]="name" class="hv-avatar-img" [style.width.px]="size" [style.height.px]="size" />
    } @else {
      <div class="hv-avatar-fallback" [style.width.px]="size" [style.height.px]="size" [style.fontSize.px]="size * 0.38">
        {{ initials }}
      </div>
    }
  `,
  styles: [`
    :host { display: inline-flex; flex-shrink: 0; }
    .hv-avatar-img {
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--color-border);
    }
    .hv-avatar-fallback {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
      color: #1F2937;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
    }
  `],
})
export class AvatarComponent {
  @Input() src?: string | null;
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() name = '';
  @Input() size = 40;

  get initials(): string {
    return getInitials(this.firstName, this.lastName);
  }
}
