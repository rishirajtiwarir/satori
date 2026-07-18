import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private apiUrl = `${API_BASE_URL}/api/v1/vocabulary`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lists`, { headers: this.getHeaders() });
  }

  createList(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lists`, { name }, { headers: this.getHeaders() });
  }

  saveWord(listId: number, japaneseWord: string, reading: string, englishMeaning: string, priority: string): Observable<any> {
    const payload = { listId, japaneseWord, reading, englishMeaning, priority };
    return this.http.post<any>(`${this.apiUrl}/words`, payload, { headers: this.getHeaders() });
  }

  getWords(listId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lists/${listId}/words`, { headers: this.getHeaders() });
  }
}
