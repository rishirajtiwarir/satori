import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_BASE_URL}/api/v1/auth`;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (response.timeSpent !== undefined) {
            localStorage.setItem('timeSpent', response.timeSpent.toString());
          }
        }
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (response.timeSpent !== undefined) {
            localStorage.setItem('timeSpent', response.timeSpent.toString());
          }
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('timeSpent');
  }
}
