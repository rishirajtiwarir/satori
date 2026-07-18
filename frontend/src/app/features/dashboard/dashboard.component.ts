import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { SpeechService, VoiceSettings } from '../../core/services/speech.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AboutModalComponent } from '../../shared/components/about-modal/about-modal.component';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AboutModalComponent, AnimatedBackgroundComponent],
  template: `
    <div class="min-h-screen bg-transparent text-white flex flex-col font-sans overflow-x-hidden relative">
      
      <!-- Global Animated Background -->
      <app-animated-background></app-animated-background>

      <!-- Real Sakura Branch (Right Side Edge) -->
      <div class="fixed top-[15%] right-0 z-10 w-96 h-96 md:w-[700px] md:h-[700px] pointer-events-none opacity-85 transform translate-x-24 md:translate-x-48" 
           style="mask-image: radial-gradient(ellipse at right center, black 30%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at right center, black 30%, transparent 70%);">
        <img src="sakura_branch.png?v=4" alt="Sakura Decor" 
             class="w-full h-full object-cover mix-blend-screen filter contrast-125 saturate-[1.7] drop-shadow-[0_0_15px_rgba(255,183,197,0.8)] transform -rotate-[30deg]">
      </div>

      <!-- Persistent Global Logo (Top Left) -->
      <div class="fixed top-0 left-0 z-50 p-6 md:p-8 flex items-center gap-3 w-full bg-gradient-to-b from-slate-950/80 to-transparent">
        <img src="assets/logo_satori.png" alt="Satori Logo" class="w-10 h-10 rounded-2xl shadow-lg shadow-indigo-500/30 object-cover border border-white/10">
        <div class="text-2xl font-black text-white tracking-tight drop-shadow-md">
          Satori
        </div>
        <div class="ml-auto flex items-center gap-4">
          <div class="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-xs font-bold text-rose-100 uppercase tracking-widest">Live</span>
          </div>
          
          <!-- Time Spent Widget -->
          <div class="hidden md:flex items-center gap-2 mr-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md shadow-inner shadow-indigo-500/10">
            <svg class="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-xs font-bold text-indigo-100 uppercase tracking-widest">{{ formattedTime$ | async }}</span>
          </div>

          <!-- Profile Button -->
          <a routerLink="/profile" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all shadow-sm flex items-center gap-2 font-bold">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Profile
          </a>
          
          <button (click)="logout()" class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>

      <main class="flex-grow flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 w-full relative z-10 h-screen">
        
        <!-- Hero Text -->
        <div class="max-w-3xl mb-12 animate-fade-in-left">
          <h1 class="text-6xl md:text-8xl font-black tracking-tight mb-4 drop-shadow-2xl">
            Master the <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Language.</span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl drop-shadow-lg mb-8">
            Immerse yourself in Japanese culture. Your personalized JLPT journey continues here.
          </p>
          
          <div class="flex gap-4">
            <button routerLink="/passage-reader" class="px-8 py-4 rounded-full bg-white text-slate-900 font-black text-lg hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-xl shadow-white/10 hover:scale-105 active:scale-95 duration-300">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
              Start Studying
            </button>
            <button (click)="openAbout()" class="px-8 py-4 rounded-full bg-slate-600/50 backdrop-blur-md text-white font-bold text-lg hover:bg-slate-500/50 transition-colors border border-slate-400/30 flex items-center gap-2 hover:scale-105 active:scale-95 duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              More Info
            </button>
          </div>
        </div>
        
        <!-- Netflix Style Horizontal Row -->
        <div class="mt-auto -mx-6 md:-mx-12 px-6 md:px-12 pb-8">
          <h3 class="text-2xl font-bold mb-4 flex items-center gap-2 drop-shadow-md">
            Trending Tools <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </h3>
          
          <!-- The Scroll Container -->
          <div class="flex gap-4 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide" style="scrollbar-width: none;">
            
            <!-- Tool 1: JLPT Analyzer -->
            <a routerLink="/passage-reader" class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-2xl">
              <div class="absolute -inset-32 bg-gradient-to-br from-rose-500/40 to-orange-500/40 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700"></div>
              
              <div class="absolute -top-2 -right-2 p-4 opacity-5 transform group-hover:scale-110 group-hover:opacity-15 group-hover:-rotate-6 transition-all duration-700">
                <span class="text-6xl font-black text-white">読</span>
              </div>
              
              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <!-- Icon Top -->
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                
                <!-- Text Bottom -->
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm group-hover:bg-rose-500/40 transition-colors">Most Popular</span>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 md:mb-2 tracking-tight group-hover:text-rose-300 transition-colors">N3 Analyzer</h3>
                  <p class="text-slate-300 font-medium text-[10px] md:text-xs opacity-80 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 leading-tight">Extract vocab & meanings instantly.</p>
                </div>
              </div>
            </a>

            <!-- Tool 2: Dictionary -->
            <a routerLink="/dictionary" class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-2xl">
              <div class="absolute -inset-32 bg-gradient-to-br from-indigo-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700"></div>
              
              <div class="absolute -top-2 -right-2 p-4 opacity-5 transform group-hover:scale-110 group-hover:opacity-15 group-hover:-rotate-6 transition-all duration-700">
                <span class="text-6xl font-black text-white">辞</span>
              </div>
              
              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <!-- Icon Top -->
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                
                <!-- Text Bottom -->
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm group-hover:bg-indigo-500/40 transition-colors">190K+ Words</span>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 md:mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">Dictionary</h3>
                  <p class="text-slate-300 font-medium text-[10px] md:text-xs opacity-80 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 leading-tight">Search kanji and detailed meanings.</p>
                </div>
              </div>
            </a>

            <!-- Tool 3: Vocabulary Lists -->
            <a routerLink="/vocabulary-lists" class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-2xl">
              <div class="absolute -inset-32 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700"></div>
              
              <div class="absolute -top-2 -right-2 p-4 opacity-5 transform group-hover:scale-110 group-hover:opacity-15 group-hover:-rotate-6 transition-all duration-700">
                <span class="text-6xl font-black text-white">単</span>
              </div>
              
              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <!-- Icon Top -->
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                
                <!-- Text Bottom -->
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm group-hover:bg-emerald-500/40 transition-colors">Study Hub</span>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 md:mb-2 tracking-tight group-hover:text-emerald-300 transition-colors">My Vocab</h3>
                  <p class="text-slate-300 font-medium text-[10px] md:text-xs opacity-80 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 leading-tight">Organize and review your lists.</p>
                </div>
              </div>
            </a>

            <!-- Tool 4: Quiz -->
            <a routerLink="/quiz" class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-2xl">
              <div class="absolute -inset-32 bg-gradient-to-br from-pink-500/40 to-rose-500/40 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700"></div>
              
              <div class="absolute -top-2 -right-2 p-4 opacity-5 transform group-hover:scale-110 group-hover:opacity-15 group-hover:-rotate-6 transition-all duration-700">
                <span class="text-6xl font-black text-white">試</span>
              </div>
              
              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm group-hover:bg-pink-500/40 transition-colors">Test Yourself</span>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 md:mb-2 tracking-tight group-hover:text-pink-300 transition-colors">Flash Quiz</h3>
                  <p class="text-slate-300 font-medium text-[10px] md:text-xs opacity-80 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 leading-tight">Earn XP and test your memory.</p>
                </div>
              </div>
            </a>

            <!-- Tool 5: Leaderboard -->
            <a routerLink="/leaderboard" class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-2xl">
              <div class="absolute -inset-32 bg-gradient-to-br from-yellow-400/40 to-orange-500/40 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700"></div>
              
              <div class="absolute -top-2 -right-2 p-4 opacity-5 transform group-hover:scale-110 group-hover:opacity-15 group-hover:-rotate-6 transition-all duration-700">
                <span class="text-6xl font-black text-white">王</span>
              </div>
              
              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm group-hover:bg-yellow-500/40 transition-colors">Global Ranks</span>
                  <h3 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 md:mb-2 tracking-tight group-hover:text-yellow-300 transition-colors">Leaderboard</h3>
                  <p class="text-slate-300 font-medium text-[10px] md:text-xs opacity-80 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 leading-tight">Compete with top learners.</p>
                </div>
              </div>
            </a>
            
            <!-- Tool 4: Grammar (Coming Soon) -->
            <div class="min-w-[220px] md:min-w-[260px] aspect-[16/10] rounded-3xl relative overflow-hidden group snap-start cursor-not-allowed transition-all duration-500 border border-white/5 bg-slate-800/30 backdrop-blur-xl">
              <div class="absolute -top-2 -right-2 p-4 opacity-5">
                <span class="text-6xl font-black text-slate-500">文</span>
              </div>

              <div class="relative z-10 flex flex-col h-full justify-between p-4 md:p-6">
                <!-- Icon Top -->
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                
                <!-- Text Bottom -->
                <div class="flex flex-col mt-auto">
                  <span class="px-2 py-1 md:px-3 md:py-1 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md w-fit mb-2 md:mb-3 shadow-sm">Coming Soon</span>
                  <h3 class="text-xl md:text-2xl font-black text-slate-500 leading-tight mb-1 md:mb-2 tracking-tight">Grammar</h3>
                  <p class="text-slate-600 font-medium text-[10px] md:text-xs opacity-80 leading-tight">Master JLPT sentences.</p>
                </div>
              </div>
            </div>

            <!-- Fake Spacer to allow scrolling past the last item easily -->
            <div class="min-w-[20px] md:min-w-[40px]"></div>

          </div>
        </div>
      </main>

      <!-- Settings Modal -->
      <div *ngIf="showSettings" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in-up p-4" style="animation-duration: 0.3s">
        <div class="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-600/20 blur-[60px] pointer-events-none"></div>
          
          <button (click)="closeSettings()" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h2 class="text-3xl font-black mb-6 relative z-10 text-white">Voice Settings</h2>
          
          <div class="mb-6 relative z-10">
            <label class="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Select Voice</label>
            <select [(ngModel)]="ttsSettings.voiceURI" class="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white font-bold outline-none focus:border-rose-500 appearance-none">
              <option [value]="null">Default Voice</option>
              <option *ngFor="let v of (speechService.voices$ | async)" [value]="v.voiceURI" class="bg-slate-900">{{ v.name }} ({{ v.lang }})</option>
            </select>
          </div>

          <div class="mb-6 relative z-10">
            <label class="flex justify-between text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">
              <span>Speed (Rate)</span>
              <span class="text-rose-400">{{ ttsSettings.rate }}x</span>
            </label>
            <input type="range" min="0.5" max="2" step="0.1" [(ngModel)]="ttsSettings.rate" class="w-full accent-rose-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer">
          </div>

          <div class="mb-8 relative z-10">
            <label class="flex justify-between text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">
              <span>Pitch</span>
              <span class="text-rose-400">{{ ttsSettings.pitch }}</span>
            </label>
            <input type="range" min="0.1" max="2" step="0.1" [(ngModel)]="ttsSettings.pitch" class="w-full accent-rose-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer">
          </div>

          <div class="flex gap-4 relative z-10">
            <button (click)="testVoice()" class="w-1/2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold transition-all text-white flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg> Test
            </button>
            <button (click)="saveSettings()" class="w-1/2 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-rose-500/25">Save</button>
          </div>
        </div>
      </div>

      <!-- About Developer Modal -->
      <app-about-modal *ngIf="showAbout" (close)="closeAbout()"></app-about-modal>
    </div>

    <style>
      /* Hide scrollbar for Chrome, Safari and Opera */
      .scrollbar-hide::-webkit-scrollbar {
          display: none;
      }
      /* Hide scrollbar for IE, Edge and Firefox */
      .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
      }
    </style>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  formattedTime$: Observable<string>;
  
  // Settings Modal
  showSettings = false;
  ttsSettings: VoiceSettings = { voiceURI: null, rate: 1, pitch: 1 };
  
  // About Modal
  showAbout = false;

  constructor(
    private authService: AuthService, 
    private timeTrackingService: TimeTrackingService,
    public speechService: SpeechService,
    private router: Router
  ) {
    this.formattedTime$ = this.timeTrackingService.timeSpent$.pipe(
      map(seconds => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
      })
    );
  }

  ngOnInit() {
    this.timeTrackingService.startTracking();
  }

  ngOnDestroy() {
  }
  
  openSettings() {
    this.ttsSettings = this.speechService.getSettings();
    this.showSettings = true;
  }

  closeSettings() {
    this.showSettings = false;
  }

  saveSettings() {
    this.speechService.saveSettings(this.ttsSettings);
    this.showSettings = false;
  }

  testVoice() {
    // Temporarily save to test with current sliders
    this.speechService.saveSettings(this.ttsSettings);
    this.speechService.speak("こんにちは、これはテストです。");
  }
  
  openAbout() {
    this.showAbout = true;
  }
  
  closeAbout() {
    this.showAbout = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
