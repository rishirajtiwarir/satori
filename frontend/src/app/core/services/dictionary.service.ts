import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private apiUrl = `${API_BASE_URL}/api/v1/dictionary/search`;

  constructor(private http: HttpClient) {}

  search(keyword: string): Observable<any> {
    // If it contains Japanese characters (Hiragana, Katakana, Kanji), skip translation
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(keyword);
    
    if (hasJapanese) {
      return this.executeSearch(keyword);
    }

    // Translate to English first using free Google Translate endpoint
    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(keyword)}`;
    
    return this.http.get<any>(translateUrl).pipe(
      switchMap(res => {
        let translatedKeyword = keyword;
        try {
          if (res && res[0] && res[0][0] && res[0][0][0]) {
            translatedKeyword = res[0][0][0];
            console.log(`Translated "${keyword}" to "${translatedKeyword}"`);
          }
        } catch (e) {}
        
        return this.executeSearch(translatedKeyword);
      }),
      catchError(() => this.executeSearch(keyword))
    );
  }

  private executeSearch(keyword: string): Observable<any> {
    const params = new HttpParams().set('keyword', keyword);
    const token = localStorage.getItem('token');
    
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any>(this.apiUrl, { params, headers });
  }
}
