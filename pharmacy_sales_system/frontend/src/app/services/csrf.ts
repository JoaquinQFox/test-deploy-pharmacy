import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Csrf {
  private token: string | null = null

  constructor(private http: HttpClient) {}

  fetchToken() : void {
    this.http.get<{ csrfToken: string }>('https://test-backend-si7g.onrender.com/api/csrf/', {
    withCredentials: true
    }).subscribe({
      next: (response) => {
        this.token = response.csrfToken;
        console.log('Token CSRF guardado:', this.token);
      },
      error: (err) => {
        console.error('Error al obtener CSRF token:', err);
      }
    });
  }

  getToken() : string | null {
    return this.token;
  }
}