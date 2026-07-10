import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'hv-auth-layout',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <div class="auth-shell">
      <div class="auth-visual">
        <div class="visual-inner">
          <span class="brand-mark">🐝</span>
          <h1>Hive</h1>
          <p>Where communities communicate, collaborate, and grow together.</p>
        </div>
      </div>
      <div class="auth-form-area">
        <router-outlet />
      </div>
    </div>
    <hv-toast-container />
  `,
  styles: [`
    .auth-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .auth-visual {
      background: linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1F2937;
      padding: 40px;
    }
    .visual-inner { max-width: 380px; }
    .brand-mark { font-size: 56px; }
    .visual-inner h1 {
      font-size: 40px;
      margin: 12px 0 8px;
      color: #1F2937;
    }
    .visual-inner p { font-size: 16px; color: rgba(31,41,55,0.8); }
    .auth-form-area {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: var(--color-bg);
    }
    @media (max-width: 900px) {
      .auth-shell { grid-template-columns: 1fr; }
      .auth-visual { display: none; }
    }
  `],
})
export class AuthLayoutComponent {}
