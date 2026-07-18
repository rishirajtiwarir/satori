import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface QuizQuestion {
  id: number;
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
  
  constructor() { }

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

  saveScore(score: number): void {
    const currentScore = parseInt(localStorage.getItem('totalScore') || '0', 10);
    localStorage.setItem('totalScore', (currentScore + score).toString());
  }
}
