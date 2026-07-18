import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DictionaryService } from '../../core/services/dictionary.service';
import { HistoryService } from '../../core/services/history.service';
import { VocabularyService } from '../../core/services/vocabulary.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500/50 relative">
      
      <!-- Ambient Background Blobs (Indigo/Purple Theme) -->
      <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-blob"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-blob" style="animation-delay: 2s"></div>
      </div>

      <!-- Navbar -->
      <nav class="w-full flex-shrink-0 flex justify-between items-center px-8 py-4 bg-transparent border-b border-white/10 backdrop-blur-2xl z-50">
        <a routerLink="/dashboard" class="flex items-center gap-3 group cursor-pointer">
          <img src="assets/logo_satori.png" alt="Satori Logo" class="w-10 h-10 rounded-2xl shadow-lg shadow-indigo-500/30 object-cover border border-white/10 group-hover:scale-105 transition-transform">
          <div class="text-2xl font-black text-white tracking-tight drop-shadow-md hidden md:block">
            Satori
          </div>
        </a>
        <div class="flex gap-4 items-center">
          <div class="hidden md:block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold rounded-full text-xs uppercase tracking-widest mr-2">Dictionary</div>
          <a routerLink="/vocabulary-lists" class="font-bold text-slate-400 hover:text-white transition-colors">My Lists</a>
          <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 font-semibold transition-colors backdrop-blur-md">Dashboard</a>
        </div>
      </nav>

      <main class="flex-grow pt-16 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 relative z-10">
        
        <!-- Sidebar (History) -->
        <aside class="w-full md:w-1/4 animate-fade-in-right">
          <div class="rounded-[2rem] bg-white/5 backdrop-blur-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
            
            <h3 class="text-lg font-black mb-6 flex items-center gap-2 text-white">
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Recent Searches
            </h3>
            
            <div *ngIf="historyLoading" class="text-slate-400 text-sm flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Loading history...
            </div>
            <div *ngIf="!historyLoading && searchHistory.length === 0" class="text-slate-500 text-sm italic">No recent searches.</div>
            
            <ul *ngIf="!historyLoading && searchHistory.length > 0" class="space-y-2 relative z-10">
              <li *ngFor="let item of searchHistory" 
                  (click)="searchQuery = item.query; onSearch()"
                  class="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all flex justify-between items-center group">
                <span class="font-medium text-slate-300 group-hover:text-indigo-300">{{ item.query }}</span>
                <svg class="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Content -->
        <section class="w-full md:w-3/4 flex flex-col">
          
          <!-- Search Bar (Spotlight Style) -->
          <div class="mb-10 animate-fade-in-up" [ngClass]="{'mt-16 md:mt-24': !hasSearched}">
            
            <!-- Branding Header above Search Bar (Only shown before search) -->
            <div *ngIf="!hasSearched" class="flex flex-col items-center gap-4 mb-8">
              <img src="assets/logo_satori.png" alt="Satori Logo" class="w-20 h-20 rounded-[1.5rem] shadow-2xl shadow-indigo-500/20 border border-white/10 animate-pulse-slow">
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">Satori Dictionary</h1>
              <p class="text-slate-400 font-medium text-sm">Translate and build your vocabulary list</p>
            </div>

            <div class="relative w-full max-w-3xl mx-auto">
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()"
                     class="w-full pl-8 pr-16 py-6 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-indigo-500/30 text-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-2xl shadow-indigo-900/20" 
                     placeholder="Search words, romaji, kanji...">
              <button (click)="onSearch()" [disabled]="isLoading || !searchQuery.trim()"
                      class="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-[1.5rem] bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25">
                <span *ngIf="isLoading"><svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>
                <span *ngIf="!isLoading"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
              </button>
            </div>
            
            <div *ngIf="!hasSearched" class="text-center mt-12 text-slate-500 font-medium">
              <p>Type a Japanese word, kanji, or romaji (e.g., <span class="text-indigo-400 cursor-pointer" (click)="searchQuery='sakura'; onSearch()">sakura</span>, <span class="text-purple-400 cursor-pointer" (click)="searchQuery='日本'; onSearch()">日本</span>)</p>
            </div>
          </div>

          <!-- Results -->
          <div *ngIf="hasSearched && !isLoading" class="animate-fade-in-up space-y-6">
            <div *ngIf="results.length === 0" class="text-center p-16 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/5">
              <div class="text-6xl mb-6 opacity-80">🤷‍♂️</div>
              <h3 class="text-3xl font-black mb-2 text-slate-300">No results found</h3>
              <p class="text-slate-500">Try searching for a different word or romaji spelling.</p>
            </div>

            <div *ngFor="let item of results; let i = index" class="relative rounded-[2.5rem] bg-white/5 backdrop-blur-3xl p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-10 hover:bg-white/10 transition-colors group">
              
              <div class="flex flex-col items-start min-w-[220px]">
                <div class="text-xs font-black text-indigo-400 mb-2 tracking-widest uppercase">{{ item.japanese[0]?.reading }}</div>
                <div class="flex items-center gap-4 mb-6">
                  <h3 class="text-5xl font-black text-white group-hover:text-indigo-100 transition-colors">{{ item.japanese[0]?.word || item.japanese[0]?.reading }}</h3>
                  <button (click)="playAudio(item.japanese[0]?.reading || item.japanese[0]?.word)" class="w-12 h-12 flex-shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/50 hover:text-white hover:scale-110 transition-all border border-indigo-500/30 shadow-lg shadow-indigo-500/20" title="Listen to pronunciation">
                    <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                  </button>
                </div>
                <button (click)="openSaveModal(item)" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-xl hover:bg-indigo-500/40 border border-indigo-500/20 transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  Save Word
                </button>
              </div>

              <div class="flex-grow space-y-8">
                <div *ngFor="let sense of item.senses; let j = index" class="relative">
                  <div class="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent rounded-full hidden md:block"></div>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span *ngFor="let pos of sense.parts_of_speech" class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">{{ pos }}</span>
                  </div>
                  <ul class="list-none space-y-2">
                    <li class="text-xl font-medium flex items-start text-slate-200">
                      <span class="text-indigo-400 mr-3 font-black text-2xl">{{ j + 1 }}.</span>
                      <span class="leading-relaxed">{{ sense.english_definitions.join(', ') }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Save Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in-up p-4" style="animation-duration: 0.3s">
        <div class="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[60px] pointer-events-none"></div>
          
          <button (click)="showModal = false" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h2 class="text-3xl font-black mb-6 relative z-10 text-white">Save Vocabulary</h2>
          
          <div class="mb-8 p-5 rounded-2xl bg-black/40 border border-white/5 relative z-10">
            <div class="text-4xl font-black mb-2 text-white">{{ selectedWord?.japanese[0]?.word || selectedWord?.japanese[0]?.reading }}</div>
            <div class="text-sm text-slate-400 font-medium">{{ selectedWord?.senses[0]?.english_definitions.join(', ') }}</div>
          </div>

          <div class="mb-6 relative z-10">
            <label class="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Select List</label>
            <select [(ngModel)]="selectedListId" class="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white font-bold outline-none focus:border-indigo-500 appearance-none">
              <option *ngFor="let list of vocabLists" [value]="list.id" class="bg-slate-900">{{ list.name }}</option>
            </select>
          </div>

          <div class="mb-8 relative z-10">
            <label class="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Priority</label>
            <div class="grid grid-cols-3 gap-3">
              <button (click)="selectedPriority = 'HIGH'" [ngClass]="selectedPriority === 'HIGH' ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/5 text-slate-400 border-white/5'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">High</button>
              <button (click)="selectedPriority = 'MEDIUM'" [ngClass]="selectedPriority === 'MEDIUM' ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/5 text-slate-400 border-white/5'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">Medium</button>
              <button (click)="selectedPriority = 'LOW'" [ngClass]="selectedPriority === 'LOW' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-slate-400 border-white/5'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">Low</button>
            </div>
          </div>

          <button (click)="saveWord()" [disabled]="savingWord" class="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold transition-all shadow-lg shadow-indigo-500/25">
            {{ savingWord ? 'Saving...' : 'Save to List' }}
          </button>
        </div>
      </div>

    </div>
  `
})
export class DictionaryComponent implements OnInit {
  searchQuery = '';
  isLoading = false;
  hasSearched = false;
  results: any[] = [];
  
  // History
  searchHistory: any[] = [];
  historyLoading = true;

  // Modal
  showModal = false;
  selectedWord: any = null;
  vocabLists: any[] = [];
  selectedListId: number | null = null;
  selectedPriority: string = 'MEDIUM';
  savingWord = false;

  constructor(
    private dictionaryService: DictionaryService,
    private historyService: HistoryService,
    private vocabService: VocabularyService
  ) {}

  ngOnInit() {
    this.loadHistory();
    this.loadVocabLists();

    const storedQuery = sessionStorage.getItem('dict_search');
    if (storedQuery) {
      this.searchQuery = storedQuery;
      this.onSearch();
      sessionStorage.removeItem('dict_search');
    }
  }

  playAudio(text: string | undefined) {
    if (!text) return;
    
    // Stop any ongoing audio
    window.speechSynthesis.cancel(); 
    
    // Tiny timeout to fix Chrome bug where it drops new utterances after cancel()
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

  loadHistory() {
    this.historyService.getSearchHistory().subscribe({
      next: (res) => {
        this.searchHistory = res.slice(0, 10); // show top 10
        this.historyLoading = false;
      },
      error: () => this.historyLoading = false
    });
  }

  loadVocabLists() {
    this.vocabService.getLists().subscribe({
      next: (res) => {
        this.vocabLists = res;
        if (this.vocabLists.length > 0) {
          this.selectedListId = this.vocabLists[0].id;
        }
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.isLoading = true;
    this.hasSearched = true;
    this.dictionaryService.search(this.searchQuery.trim()).subscribe({
      next: (response) => {
        const rawResults = response.data || [];
        
        // Filter out non-Japanese foreign words (like Korean/Chinese hello) 
        // We keep it if it's common, OR if it has no foreign source, OR if the source is English
        this.results = rawResults.filter((item: any) => {
          if (item.is_common) return true;
          
          const hasObscureForeignSource = item.senses?.some((sense: any) => {
            return sense.source?.some((src: any) => {
              const lang = src.language;
              return lang && !['English', 'Dutch', 'Portuguese', 'French', 'German'].includes(lang);
            });
          });
          
          return !hasObscureForeignSource;
        });

        this.isLoading = false;
        this.loadHistory(); // Reload history to show the new search
      },
      error: (err) => {
        this.results = [];
        this.isLoading = false;
      }
    });
  }

  openSaveModal(wordItem: any) {
    this.selectedWord = wordItem;
    this.showModal = true;
  }

  saveWord() {
    if (!this.selectedListId || !this.selectedWord) return;
    
    this.savingWord = true;
    const japaneseWord = this.selectedWord.japanese[0]?.word || this.selectedWord.japanese[0]?.reading;
    const reading = this.selectedWord.japanese[0]?.reading || '';
    const meaning = this.selectedWord.senses[0]?.english_definitions.join(', ') || '';

    this.vocabService.saveWord(this.selectedListId, japaneseWord, reading, meaning, this.selectedPriority).subscribe({
      next: (res) => {
        this.savingWord = false;
        this.showModal = false;
        alert('Word saved successfully!');
      },
      error: (err) => {
        this.savingWord = false;
        alert('Failed to save word');
      }
    });
  }
}
