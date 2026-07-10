import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'hv-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: '../auth-shared.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  submitting = false;

  form = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password } = this.form.getRawValue();
    const isEmail = identifier!.includes('@');

    this.submitting = true;
    this.auth
      .login({
        [isEmail ? 'email' : 'username']: identifier,
        password: password!,
      })
      .subscribe({
        next: () => {
          this.toast.show('Welcome back!', 'success');
          this.router.navigate(['/']);
        },
        error: () => {
          this.submitting = false;
        },
      });
  }
}
