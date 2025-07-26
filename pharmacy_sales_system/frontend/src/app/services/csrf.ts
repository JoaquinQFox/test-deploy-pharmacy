import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Csrf {
  constructor(private http: HttpClient) {}

  getToken() {
    return this.http.get<{ csrfToken: string }>('https://test-backend-si7g.onrender.com/api/csrf/', {
      withCredentials: true
    });
  }
}