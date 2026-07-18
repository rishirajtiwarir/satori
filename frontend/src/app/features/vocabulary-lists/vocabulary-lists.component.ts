import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VocabularyService } from '../../core/services/vocabulary.service';

@Component({
  selector: 'app-vocabulary-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      
      <!-- Ambient Background Blobs (Emerald Theme) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
        <div class="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-teal-500/10 blur-[120px]"></div>
      </div>

      <!-- Navbar -->
      <nav class="w-full flex-shrink-0 flex justify-between items-center px-8 py-4 bg-transparent border-b border-white/10 backdrop-blur-2xl z-50">
        <a routerLink="/dashboard" class="flex items-center gap-3 group cursor-pointer">
          <img src="assets/logo_satori.png" alt="Satori Logo" class="w-10 h-10 rounded-2xl shadow-lg shadow-indigo-500/30 object-cover border border-white/10">
          <div class="text-2xl font-black text-white tracking-tight drop-shadow-md hidden md:block">
            Satori
          </div>
        </a>
        <div class="flex gap-4 items-center">
          <div class="hidden md:block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-full text-xs uppercase tracking-widest mr-2">My Vocabulary</div>
          <a routerLink="/dictionary" class="font-bold text-slate-400 hover:text-white transition-colors">Dictionary</a>
          <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 font-semibold transition-colors backdrop-blur-md">Dashboard</a>
        </div>
      </nav>

      <main class="flex-grow p-6 md:p-10 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-8 relative z-10">
        
        <!-- Lists Sidebar -->
        <aside class="w-full md:w-1/3 flex flex-col">
          <div class="bg-white/5 backdrop-blur-3xl rounded-[2rem] p-6 shadow-2xl border border-white/10 flex-grow flex flex-col">
            <h2 class="text-2xl font-black mb-6 text-white flex items-center gap-2">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Your Lists
            </h2>
            
            <div class="flex gap-3 mb-8">
              <input type="text" [(ngModel)]="newListName" placeholder="New list name..." class="flex-grow p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all">
              <button (click)="createList()" [disabled]="!newListName.trim()" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-black text-xl disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20">+</button>
            </div>

            <div *ngIf="isLoadingLists" class="text-slate-400 text-sm flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Loading lists...
            </div>
            
            <ul *ngIf="!isLoadingLists" class="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <li *ngFor="let list of lists" 
                  (click)="selectList(list)"
                  [ngClass]="selectedList?.id === list.id ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/30' : 'bg-white/5 hover:bg-white/10 border-white/5'"
                  class="p-4 rounded-xl cursor-pointer transition-all border flex justify-between items-center group relative overflow-hidden">
                <div *ngIf="selectedList?.id === list.id" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl"></div>
                <span class="font-bold text-white group-hover:text-emerald-300 transition-colors" [ngClass]="{'pl-2 text-emerald-100': selectedList?.id === list.id}">{{ list.name }}</span>
                <svg class="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" [ngClass]="{'opacity-100': selectedList?.id === list.id}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Words Content -->
        <section class="w-full md:w-2/3">
          <div *ngIf="!selectedList" class="h-full flex flex-col items-center justify-center text-slate-500 p-12 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/5 border-dashed">
            <svg class="w-20 h-20 mb-6 opacity-30 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <p class="text-xl font-medium">Select a list to view your saved words.</p>
          </div>

          <div *ngIf="selectedList" class="bg-white/5 backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl border border-white/10 min-h-[600px] flex flex-col relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div class="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
              <div>
                <div class="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-1">Vocabulary List</div>
                <h2 class="text-4xl font-black text-white">{{ selectedList.name }}</h2>
              </div>
              <span class="px-4 py-2 bg-white/10 border border-white/5 rounded-full text-sm font-bold text-emerald-100 shadow-inner">{{ words.length }} words</span>
            </div>

            <div *ngIf="isLoadingWords" class="flex justify-center items-center py-20 text-emerald-400">
              <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>

            <div *ngIf="!isLoadingWords && words.length === 0" class="text-slate-400 text-lg p-12 text-center bg-black/20 border border-white/5 rounded-2xl">
              No words in this list yet. <br><span class="text-sm mt-2 block">Head over to the Dictionary or N3 Analyzer to start saving words!</span>
            </div>

            <div class="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              <div *ngFor="let word of words" class="p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 bg-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                
                <div>
                  <div class="text-xs font-black text-emerald-400 mb-2 uppercase tracking-widest">{{ word.reading }}</div>
                  <div class="flex items-center gap-3 mb-2">
                    <div class="text-3xl font-black text-white group-hover:text-emerald-100 transition-colors">{{ word.japaneseWord }}</div>
                    <button (click)="playAudio(word.reading || word.japaneseWord); $event.stopPropagation()" class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 hover:bg-emerald-500/50 hover:text-white hover:scale-110 transition-all border border-emerald-500/30" title="Listen">
                      <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </button>
                  </div>
                  <div class="text-slate-300 font-medium">{{ word.englishMeaning }}</div>
                </div>

                <div class="flex flex-col items-end gap-3 min-w-[120px]">
                  <span [ngClass]="{
                    'bg-rose-500/20 text-rose-300 border-rose-500/30': word.priority === 'HIGH',
                    'bg-orange-500/20 text-orange-300 border-orange-500/30': word.priority === 'MEDIUM',
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': word.priority === 'LOW'
                  }" class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm">
                    {{ word.priority }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {{ word.savedAt | date:'MMM d, y' }}
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `
})
export class VocabularyListsComponent implements OnInit {
  lists: any[] = [];
  selectedList: any = null;
  words: any[] = [];
  
  newListName = '';
  isLoadingLists = true;
  isLoadingWords = false;

  constructor(private vocabService: VocabularyService) {}

  ngOnInit() {
    this.loadLists();
  }

  playAudio(text: string) {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

  loadLists() {
    this.isLoadingLists = true;
    this.vocabService.getLists().subscribe({
      next: (res) => {
        this.lists = res;
        this.isLoadingLists = false;
        if (this.lists.length > 0 && !this.selectedList) {
          this.selectList(this.lists[0]);
        }
      },
      error: () => this.isLoadingLists = false
    });
  }

  createList() {
    if (!this.newListName.trim()) return;
    this.vocabService.createList(this.newListName.trim()).subscribe({
      next: (res) => {
        this.newListName = '';
        this.loadLists(); // Reload
      },
      error: (err) => {
        alert("Failed to create list: " + (err.error || err.message));
      }
    });
  }

  selectList(list: any) {
    this.selectedList = list;
    this.isLoadingWords = true;
    this.vocabService.getWords(list.id).subscribe({
      next: (res) => {
        this.words = res;
        this.isLoadingWords = false;
      },
      error: () => this.isLoadingWords = false
    });
  }
}
