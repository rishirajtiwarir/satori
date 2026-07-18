import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnalyzerService } from '../../core/services/analyzer.service';
import { DictionaryService } from '../../core/services/dictionary.service';
import { VocabularyService } from '../../core/services/vocabulary.service';
import { SpeechService } from '../../core/services/speech.service';

@Component({
  selector: 'app-passage-reader',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans h-screen overflow-hidden relative selection:bg-rose-500/30">
      
      <!-- Ambient Background Blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[100px]"></div>
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
          <div class="hidden md:block px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold rounded-full text-xs uppercase tracking-widest mr-2">JLPT Analyzer</div>
          <a routerLink="/dictionary" class="font-bold text-slate-400 hover:text-white transition-colors">Dictionary</a>
          <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 font-semibold transition-colors backdrop-blur-md">Dashboard</a>
        </div>
      </nav>

      <!-- Main Layout: Split Screen -->
      <main class="flex-grow flex flex-col md:flex-row h-full overflow-hidden p-6 gap-6 relative z-10 max-w-[1600px] mx-auto w-full">
        
        <!-- LEFT PANEL: Text Editor & Reader -->
        <section class="w-full md:w-1/2 h-full flex flex-col rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
          
          <div class="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h2 class="font-bold text-lg flex items-center gap-2">
              <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Your Text
            </h2>
            <div class="flex gap-3">
              <input type="file" accept=".txt" #fileInput (change)="onFileSelected($event)" class="hidden">
              <button *ngIf="isEditing" (click)="fileInput.click()" title="Upload .txt file" class="px-3 py-2 rounded-xl font-bold text-slate-300 bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              </button>
              <button *ngIf="!isEditing" (click)="isEditing = true" class="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/10 transition-all">New Text</button>
              
              <!-- Play / Stop Reading Controls -->
              <ng-container>
                <button *ngIf="!(speechService.isSpeaking$ | async)" (click)="playPassage()" [disabled]="!textContent.trim()" class="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg> Read
                </button>
                <button *ngIf="(speechService.isSpeaking$ | async)" (click)="stopPassage()" class="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 transition-all flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"></path></svg> Stop
                </button>
              </ng-container>

              <button *ngIf="isEditing" (click)="saveAndAnalyze()" [disabled]="!textContent.trim()" class="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white disabled:opacity-50 transition-all shadow-lg shadow-rose-500/25">Analyze Text</button>
            </div>
          </div>

          <!-- Edit Mode -->
          <div *ngIf="isEditing" class="flex-grow p-6 flex flex-col gap-4">
            <input type="text" [(ngModel)]="textTitle" placeholder="Passage Title (e.g., N3 Reading Q1)" class="w-full p-4 rounded-2xl bg-black/20 border border-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 text-xl font-bold outline-none placeholder-slate-600 transition-all">
            <textarea [(ngModel)]="textContent" placeholder="Paste your Japanese text here to instantly extract vocabulary and meanings..." class="w-full flex-grow p-5 rounded-2xl bg-black/20 border border-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 resize-none outline-none text-lg leading-relaxed placeholder-slate-600 transition-all scrollbar-hide"></textarea>
          </div>

          <!-- Read Mode -->
          <div *ngIf="!isEditing" class="flex-grow p-8 overflow-y-auto scrollbar-hide">
            <h1 class="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{{ textTitle }}</h1>
            <p class="text-2xl leading-loose whitespace-pre-wrap font-medium text-slate-200">{{ textContent }}</p>
          </div>

        </section>

        <!-- RIGHT PANEL: Extracted Vocabulary -->
        <section class="w-full md:w-1/2 h-full flex flex-col rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
          
          <div class="p-6 border-b border-white/10 bg-black/20">
            <h2 class="font-bold text-lg flex items-center gap-2">
              <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Extracted Vocabulary
            </h2>
          </div>

          <div class="flex-grow p-6 overflow-y-auto scrollbar-hide relative">
            
            <div *ngIf="isAnalyzing" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10 text-slate-300">
              <svg class="animate-spin h-12 w-12 mb-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p class="font-bold text-lg animate-pulse tracking-wide">Running NLP Analysis...</p>
            </div>

            <div *ngIf="!isAnalyzing && extractedWords.length === 0" class="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center opacity-70">
              <div class="text-6xl mb-6">📄</div>
              <p class="text-xl font-medium">Paste a text and click Analyze to magically extract vocabulary.</p>
            </div>

            <div *ngIf="!isAnalyzing && extractedWords.length > 0" class="grid grid-cols-1 gap-4">
              
              <!-- Word Card -->
              <div *ngFor="let ew of extractedWords" class="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group">
                
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="text-xs font-black text-rose-400 mb-1 tracking-widest uppercase">{{ ew.reading }}</div>
                    <div class="flex items-center gap-3">
                      <div class="text-3xl font-black text-white group-hover:text-rose-100 transition-colors">{{ ew.word }}</div>
                      <button (click)="playAudio(ew.reading || ew.word)" class="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 hover:bg-rose-500/50 hover:text-white hover:scale-110 transition-all border border-rose-500/30" title="Listen">
                        <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                      </button>
                    </div>
                    <div class="text-xs font-semibold text-slate-400 mt-2 bg-white/5 px-2 py-1 rounded-md w-fit">{{ ew.partOfSpeech }}</div>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <button (click)="lookupWord(ew)" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/5">Find Meaning</button>
                    <button (click)="openSaveModal(ew)" class="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/20">Save Word</button>
                  </div>
                </div>

                <!-- Dict Result Inline -->
                <div *ngIf="ew.dictionaryResult" class="mt-5 pt-4 border-t border-white/10">
                  <div class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Meaning</div>
                  <ul class="list-none space-y-1">
                    <li *ngFor="let def of ew.dictionaryResult.senses[0]?.english_definitions" class="text-sm md:text-base font-medium text-slate-200 flex items-start">
                      <span class="text-rose-400 mr-2">•</span>{{ def }}
                    </li>
                  </ul>
                </div>
                
                <div *ngIf="ew.isLookupLoading" class="mt-5 pt-4 border-t border-white/10 text-xs font-bold text-rose-400 flex items-center gap-2 animate-pulse">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Searching Jisho.org...
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      <!-- Save Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
        <div class="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-600/20 blur-[60px] pointer-events-none"></div>
          
          <h2 class="text-3xl font-black mb-8 relative z-10 text-white">Save Word</h2>
          
          <div class="mb-5 relative z-10">
            <label class="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Select List</label>
            <select [(ngModel)]="selectedListId" class="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white font-bold outline-none focus:border-rose-500 appearance-none">
              <option *ngFor="let list of vocabLists" [value]="list.id" class="bg-slate-900">{{ list.name }}</option>
            </select>
          </div>
          
          <div class="mb-8 relative z-10">
            <label class="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Priority</label>
            <div class="grid grid-cols-3 gap-3">
              <button (click)="selectedPriority = 'HIGH'" [ngClass]="selectedPriority === 'HIGH' ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/5 border-white/5 text-slate-400'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">High</button>
              <button (click)="selectedPriority = 'MEDIUM'" [ngClass]="selectedPriority === 'MEDIUM' ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/5 border-white/5 text-slate-400'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">Mid</button>
              <button (click)="selectedPriority = 'LOW'" [ngClass]="selectedPriority === 'LOW' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'" class="p-3 rounded-2xl font-bold border transition-all hover:bg-white/10">Low</button>
            </div>
          </div>
          
          <div class="flex gap-4 relative z-10">
            <button (click)="showModal = false" class="w-1/3 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold transition-all text-white">Cancel</button>
            <button (click)="saveWord()" class="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-rose-500/25">Save</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class PassageReaderComponent implements OnInit {
  isEditing = true;
  textTitle = '';
  textContent = '';
  
  extractedWords: any[] = [];
  isAnalyzing = false;

  // Modal State
  showModal = false;
  selectedWord: any = null;
  vocabLists: any[] = [];
  selectedListId: number | null = null;
  selectedPriority: string = 'MEDIUM';

  constructor(
    private analyzerService: AnalyzerService,
    private dictService: DictionaryService,
    private vocabService: VocabularyService,
    public speechService: SpeechService
  ) {}

  ngOnInit() {
    this.vocabService.getLists().subscribe({
      next: (res) => {
        this.vocabLists = res;
        if (res.length > 0) this.selectedListId = res[0].id;
      },
      error: (err) => {
        console.error("Failed to load lists:", err);
        alert("Failed to load your vocabulary lists from the backend. Please ensure the backend is running properly.");
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.textTitle = file.name.replace('.txt', '');
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.textContent = e.target.result;
      };
      reader.readAsText(file);
    }
  }

  saveAndAnalyze() {
    if (!this.textContent.trim()) return;
    
    this.isEditing = false;
    this.isAnalyzing = true;
    this.extractedWords = [];

    // Optional: Save passage to DB first
    if (this.textTitle.trim()) {
      this.analyzerService.savePassage(this.textTitle, this.textContent).subscribe();
    }

    this.analyzerService.analyzeText(this.textContent).subscribe({
      next: (words) => {
        this.extractedWords = words;
        this.isAnalyzing = false;
      },
      error: () => {
        this.isAnalyzing = false;
        alert("Failed to analyze text.");
      }
    });
  }

  playPassage() {
    this.speechService.speak(this.textContent);
  }

  stopPassage() {
    this.speechService.stop();
  }

  lookupWord(ew: any) {
    if (ew.dictionaryResult) return; // already looked up
    
    ew.isLookupLoading = true;
    this.dictService.search(ew.word).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          ew.dictionaryResult = res.data[0];
        }
        ew.isLookupLoading = false;
      },
      error: () => ew.isLookupLoading = false
    });
  }

  openSaveModal(ew: any) {
    this.selectedWord = ew;
    this.showModal = true;
  }


  playAudio(text: string) {
    if (!text) return;
    this.speechService.speak(text);
  }


  saveWord() {
    if (!this.selectedWord || !this.selectedListId) return;

    // Use dictionary meaning if available, otherwise just word and reading
    const meaning = this.selectedWord.dictionaryResult 
      ? this.selectedWord.dictionaryResult.senses[0]?.english_definitions.join(', ')
      : 'Meaning not fetched';

    this.vocabService.saveWord(this.selectedListId, this.selectedWord.word, this.selectedWord.reading, meaning, this.selectedPriority)
      .subscribe({
        next: () => {
          this.showModal = false;
          alert('Saved!');
        },
        error: () => alert('Failed to save')
      });
  }
}
