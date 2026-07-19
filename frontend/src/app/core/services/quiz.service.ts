import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';

export interface QuizQuestion {
  id?: number;
  word: string;
  reading: string;
  meaning: string;
  options: string[]; // Options for meaning
  correctOptionIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  private apiUrl = `${API_BASE_URL}/api/v1/quiz`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Generate mock quiz data
  getMockQuizSession(count: number = 5): Observable<QuizQuestion[]> {
    const mockData: QuizQuestion[] = [
      { id: 1, word: '日本', reading: 'にほん (Nihon)', meaning: 'Japan', options: ['China', 'Japan', 'Korea', 'America'], correctOptionIndex: 1 },
      { id: 2, word: '食べる', reading: 'たべる (Taberu)', meaning: 'To eat', options: ['To sleep', 'To run', 'To eat', 'To read'], correctOptionIndex: 2 },
      { id: 3, word: '学校', reading: 'がっこう (Gakkou)', meaning: 'School', options: ['Hospital', 'Bank', 'Station', 'School'], correctOptionIndex: 3 },
      { id: 4, word: '水', reading: 'みず (Mizu)', meaning: 'Water', options: ['Fire', 'Earth', 'Water', 'Wind'], correctOptionIndex: 2 },
      { id: 5, word: '車', reading: 'くるま (Kuruma)', meaning: 'Car', options: ['Car', 'Train', 'Bicycle', 'Airplane'], correctOptionIndex: 0 }
    ];
    return of(mockData.slice(0, count));
  }

  generateQuizFromPdf(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/generate-from-pdf`, formData, { headers: this.getHeaders() }).pipe(
      map(res => res.id)
    );
  }

  getQuizById(id: number): Observable<QuizQuestion[]> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(res => {
        return res.questions.map((q: any) => ({
          id: q.id,
          word: q.word,
          reading: q.reading,
          meaning: q.meaning,
          options: [q.option1, q.option2, q.option3, q.option4],
          correctOptionIndex: q.correctOptionIndex
        }));
      })
    );
  }

  saveScore(score: number): void {
    const currentScore = parseInt(localStorage.getItem('totalScore') || '0', 10);
    localStorage.setItem('totalScore', (currentScore + score).toString());
  }
}
