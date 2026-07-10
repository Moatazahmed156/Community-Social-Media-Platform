import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'hive_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.readInitial());

  constructor() {
    this.apply(this.isDark());
  }

  private readInitial(): boolean {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  toggle(): void {
    this.set(!this.isDark());
  }

  set(dark: boolean): void {
    this.isDark.set(dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    this.apply(dark);
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
