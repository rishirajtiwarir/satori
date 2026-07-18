import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
  private apiUrl = `${API_BASE_URL}/api/v1/passages`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getPassages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  savePassage(title: string, content: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { title, content }, { headers: this.getHeaders() });
  }

  analyzeText(content: string): Observable<any[]> {
    // We send content to be analyzed via Kuromoji
    return this.http.post<any[]>(`${this.apiUrl}/analyze`, { content }, { headers: this.getHeaders() });
  }
}
