import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseurl = 'http://127.0.0.1:8000/api';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseurl}${path}`, { headers: this.httpHeaders });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseurl}${path}`, body, { headers: this.httpHeaders });
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseurl}${path}`, body, { headers: this.httpHeaders });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseurl}${path}`, { headers: this.httpHeaders });
  }
}