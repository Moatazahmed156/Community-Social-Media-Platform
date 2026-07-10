import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Group } from '../../../core/models/group.model';
import { FileUrlPipe } from '../../pipes/file-url.pipe';

@Component({
  selector: 'hv-community-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FileUrlPipe],
  template: `
    <a [routerLink]="['/communities', group._id]" class="community-card card card-hover fade-in">
      <div class="cover" [style.background-image]="group.coverImage ? 'url(' + (group.coverImage | fileUrl) + ')' : null"></div>
      <div class="body">
        <div class="logo-wrap">
          @if (group.logo) {
            <img [src]="group.logo | fileUrl" alt="" class="logo" />
          } @else {
            <div class="logo logo-fallback">{{ group.name[0] }}</div>
          }
        </div>
        <div class="info">
          <h4>{{ group.name }}</h4>
          @if (group.description) {
            <p>{{ group.description }}</p>
          }
        </div>
        @if (myRole) {
          <span class="badge" [class]="'badge-' + myRole">{{ myRole }}</span>
        }
      </div>
    </a>
  `,
  styles: [`
    .community-card {
      display: block;
      padding: 0;
      overflow: hidden;
    }
    .cover {
      height: 88px;
      background-color: var(--color-primary);
      background-size: cover;
      background-position: center;
    }
    .body {
      padding: 16px;
      position: relative;
    }
    .logo-wrap { margin-top: -40px; margin-bottom: 8px; }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      object-fit: cover;
      border: 3px solid var(--color-surface);
      background: var(--color-surface);
    }
    .logo-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 22px;
      color: #1F2937;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    }
    h4 { margin-bottom: 4px; font-size: 15.5px; }
    p {
      font-size: 13px;
      color: var(--color-text-secondary);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .badge { position: absolute; top: 16px; right: 16px; }
  `],
})
export class CommunityCardComponent {
  @Input({ required: true }) group!: Group;
  @Input() myRole?: string | null;
}
