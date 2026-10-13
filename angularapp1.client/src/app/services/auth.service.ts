import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface LoginResponse { token: string; expires: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ds-admin-token';
  private expKey = 'ds-admin-exp';
  private _token = signal<string | null>(this.read());

  readonly isLoggedIn = computed(() => !!this._token());

  constructor(private http: HttpClient) { }

  get token(): string | null {
    return this._token();
  }

  async login(username: string, password: string): Promise<void> {
    const res = await firstValueFrom(this.http.post<LoginResponse>('/api/auth/login', { username, password }));
    try {
      localStorage.setItem(this.tokenKey, res.token);
      localStorage.setItem(this.expKey, res.expires);
    } catch { }
    this._token.set(res.token);
  }

  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expKey);
    } catch { }
    this._token.set(null);
  }

  private read(): string | null {
    try {
      const t = localStorage.getItem(this.tokenKey);
      const e = localStorage.getItem(this.expKey);
      if (!t || !e || new Date(e).getTime() < Date.now()) {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.expKey);
        return null;
      }
      return t;
    } catch {
      return null;
    }
  }
}
