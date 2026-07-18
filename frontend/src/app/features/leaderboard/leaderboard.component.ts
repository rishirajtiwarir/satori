import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaderboardService, LeaderboardEntry } from '../../core/services/leaderboard.service';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimatedBackgroundComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-x-hidden">
      
      <app-animated-background></app-animated-background>

      <!-- Header -->
      <div class="fixed top-0 left-0 z-50 p-6 md:p-8 flex items-center gap-3 w-full bg-gradient-to-b from-slate-950/80 to-transparent">
        <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold transition-all flex items-center gap-2 shadow-sm mr-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </a>
        <div class="text-2xl font-black text-white tracking-tight drop-shadow-md">
          Global Leaderboard
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-40 flex-1 container mx-auto px-4 md:px-8 pt-32 pb-12 flex flex-col items-center">
        
        <!-- Leaderboard Table/List -->
        <div class="w-full max-w-4xl flex flex-col gap-4">
          
          <div *ngFor="let user of topUsers" 
               class="relative overflow-hidden bg-white/5 backdrop-blur-md border rounded-[2rem] p-4 flex items-center gap-6 transition-all hover:bg-white/10 hover:scale-[1.02]"
               [ngClass]="{
                 'border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)] bg-yellow-900/10': user.rank === 1,
                 'border-slate-300/50 shadow-[0_0_30px_rgba(203,213,225,0.1)]': user.rank === 2,
                 'border-amber-700/50 shadow-[0_0_30px_rgba(180,83,9,0.1)]': user.rank === 3,
                 'border-white/10': user.rank > 3
               }">
            
            <!-- Rank -->
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center font-black text-2xl"
                 [ngClass]="{
                   'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]': user.rank === 1,
                   'text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]': user.rank === 2,
                   'text-amber-600 drop-shadow-[0_0_10px_rgba(180,83,9,0.8)]': user.rank === 3,
                   'text-slate-500': user.rank > 3
                 }">
              #{{ user.rank }}
            </div>

            <!-- Avatar -->
            <div class="w-16 h-16 rounded-full border-2 border-white/20 p-1 bg-slate-900 flex-shrink-0">
              <img [src]="user.avatarUrl" alt="Avatar" class="w-full h-full rounded-full">
            </div>

            <!-- User Info -->
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white">{{ user.username }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  🔥 {{ user.streak }} Day Streak
                </span>
              </div>
            </div>

            <!-- Score -->
            <div class="text-right pr-4">
              <div class="text-3xl font-black text-white drop-shadow-md">{{ user.score | number }}</div>
              <div class="text-xs font-bold text-indigo-300 uppercase tracking-widest">XP</div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `,
  styles: []
})
export class LeaderboardComponent implements OnInit {
  topUsers: LeaderboardEntry[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getTopUsers().subscribe(users => {
      this.topUsers = users;
    });
  }
}
