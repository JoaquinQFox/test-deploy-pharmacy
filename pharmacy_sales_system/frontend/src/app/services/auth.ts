import { Injectable, signal } from '@angular/core';
import { Api } from './api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly isAuthenticated = signal(false);

  constructor(private api: Api) {}

  login(credentials: { username: string; password: string }) {
    return this.api.post<any>('/login/', credentials).pipe(
      tap(() => this.isAuthenticated.set(true))
    );
  }

  logout() {
    return this.api.post<any>('/logout/', {}).pipe(
      tap(() => this.isAuthenticated.set(false))
    );
  }

  checkAuth() {
    return this.api.get<any>('/check-auth/').pipe(
      tap({
        next: () => this.isAuthenticated.set(true),
        error: () => this.isAuthenticated.set(false),
      })
    );
  }
}