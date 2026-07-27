import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface SenseiChatRequest {
  scenario: string;
  message: string;
  apiKey?: string;
}

export interface SenseiChatResponse {
  replyJapanese: string;
  replyRomaji: string;
  replyEnglish: string;
  grammarFeedback: string;
}

@Injectable({
  providedIn: 'root'
})
export class SenseiService {
  private apiUrl = `${API_BASE_URL}/api/v1/sensei`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public getCustomApiKey(): string {
    return localStorage.getItem('custom_gemini_key') || '';
  }

  public setCustomApiKey(key: string): void {
    if (!key.trim()) {
      localStorage.removeItem('custom_gemini_key');
    } else {
      localStorage.setItem('custom_gemini_key', key.trim());
    }
  }

  public sendMessage(scenario: string, message: string): Observable<SenseiChatResponse> {
    const apiKey = this.getCustomApiKey();
    const payload: SenseiChatRequest = { scenario, message, apiKey };
    return this.http.post<SenseiChatResponse>(`${this.apiUrl}/chat`, payload, { headers: this.getHeaders() });
  }
}
