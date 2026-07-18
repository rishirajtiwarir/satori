import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  score: number;
  streak: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor() { }

  getTopUsers(): Observable<LeaderboardEntry[]> {
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'NinjaCoder', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NinjaCoder', score: 15420, streak: 45 },
      { rank: 2, username: 'SakuraDream', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraDream', score: 14200, streak: 30 },
      { rank: 3, username: 'TokyoDrifter', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tokyo', score: 13800, streak: 12 },
      { rank: 4, username: 'KanjiMaster99', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kanji', score: 12100, streak: 8 },
      { rank: 5, username: 'SushiLover', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sushi', score: 11500, streak: 21 },
    ];
    return of(mockData);
  }
}
