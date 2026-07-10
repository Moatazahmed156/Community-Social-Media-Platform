import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';

const TOKEN_KEY = 'hive_token';
const USER_KEY = 'hive_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(this.readStoredUser());
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {}

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  register(payload: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(payload: { email?: string; username?: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password/${token}`, {
      password,
    });
  }

  fetchMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        this.currentUserSignal.set(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      })
    );
  }

  updateLocalUser(user: User) {
    this.currentUserSignal.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private persistSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUserSignal.set(res.user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }
}
