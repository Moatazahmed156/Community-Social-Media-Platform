import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || 'Something went wrong. Please try again.';

      if (error.status === 401 && auth.isLoggedIn()) {
        auth.logout();
        toast.show('Your session has expired. Please log in again.', 'error');
      } else if (error.status !== 401) {
        toast.show(message, 'error');
      }

      return throwError(() => error);
    })
  );
};
