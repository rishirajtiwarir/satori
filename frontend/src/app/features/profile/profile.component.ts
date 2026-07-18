import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
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
          Profile
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-40 flex-1 container mx-auto px-4 md:px-8 pt-32 pb-12 flex flex-col items-center">
        
        <!-- Profile Header -->
        <div class="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
          
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl"></div>

          <!-- Avatar -->
          <div class="w-32 h-32 rounded-full border-4 border-indigo-400 p-1 relative z-10 bg-slate-900 shadow-xl shadow-indigo-500/20">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NinjaCoder" alt="Avatar" class="w-full h-full rounded-full">
            <div class="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <span class="w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>

          <!-- Info -->
          <div class="text-center md:text-left z-10">
            <h1 class="text-4xl font-black mb-2 drop-shadow-md">NinjaCoder</h1>
            <p class="text-slate-400 font-medium text-lg mb-4">"Mastering the path of the Samurai."</p>
            
            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              <div class="px-4 py-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-200 font-bold text-sm shadow-sm">
                JLPT N3 Goal
              </div>
              <div class="px-4 py-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 font-bold text-sm shadow-sm">
                45 Day Streak 🔥
              </div>
            </div>
          </div>

        </div>

        <!-- Stats Grid -->
        <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
            <div class="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Time Spent</h3>
            <p class="text-3xl font-black text-white">{{ formattedTime$ | async }}</p>
          </div>

          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
            <div class="w-12 h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            </div>
            <h3 class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Score</h3>
            <p class="text-3xl font-black text-white">15,420</p>
          </div>

          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
            <div class="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Words Mastered</h3>
            <p class="text-3xl font-black text-white">128</p>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  formattedTime$!: Observable<string>;

  constructor(private timeService: TimeTrackingService) {}

  ngOnInit() {
    this.formattedTime$ = this.timeService.timeSpent$.pipe(
      map(seconds => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      })
    );
  }
}
