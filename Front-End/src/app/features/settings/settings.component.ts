import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

type SettingsTab = 'account' | 'security' | 'appearance' | 'notifications';

@Component({
  selector: 'hv-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  activeTab: SettingsTab = 'account';
  savingPassword = false;
  showDeleteConfirm = false;

  emailNotifs = true;
  pushNotifs = true;

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  setTab(tab: SettingsTab): void {
    this.activeTab = tab;
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.savingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.userService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordForm.reset();
        this.toast.show('Password changed successfully.', 'success');
      },
      error: () => (this.savingPassword = false),
    });
  }

  deleteAccount(): void {
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.toast.show('Account deleted.', 'info');
        this.auth.logout();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.toast.show('Could not delete account.', 'error');
      },
    });
  }
}
