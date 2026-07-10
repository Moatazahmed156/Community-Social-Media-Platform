import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'hv-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopnavComponent, BottomNavComponent, ToastContainerComponent],
  template: `
    <div class="shell">
      <hv-sidebar />
      <div class="content-col">
        <hv-topnav />
        <main class="main-area scrollbar-thin">
          <router-outlet />
        </main>
        <hv-bottom-nav />
      </div>
    </div>
    <hv-toast-container />
  `,
  styles: [`
    .shell { display: flex; min-height: 100vh; }
    .content-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .main-area { flex: 1; }
    @media (max-width: 900px) {
      .main-area { padding-bottom: 70px; }
    }
  `],
})
export class MainLayoutComponent implements OnInit {
  private notifications = inject(NotificationService);

  ngOnInit(): void {
    this.notifications.list(false, 1, 1).subscribe({ error: () => {} });
  }
}
