import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { QuizService } from '../../core/services/quiz.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-previous-papers',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe, AnimatedBackgroundComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden">
      <app-animated-background></app-animated-background>

      <!-- Navbar -->
      <nav class="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <a routerLink="/dashboard" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-colors">
            Dashboard
          </span>
        </a>
        <div class="flex items-center gap-4">
          <button (click)="generateQuiz()" [disabled]="!pdfFile || isGenerating" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <span *ngIf="isGenerating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <svg *ngIf="!isGenerating" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            {{ isGenerating ? 'Extracting...' : 'Generate Quiz' }}
          </button>
        </div>
      </nav>

      <main class="relative z-10 flex-grow flex w-full pt-20 h-screen overflow-hidden">
        
        <!-- Left: Paper Library Sidebar -->
        <div class="w-72 bg-slate-900/80 border-r border-white/10 backdrop-blur-xl h-full flex flex-col p-6 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Paper Library
          </h3>
          <div class="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-2">
            <button *ngFor="let paper of builtInPapers" (click)="loadBuiltInPaper(paper)"
                    class="w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 shadow-sm"
                    [ngClass]="activePaper?.id === paper.id ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-slate-800/50 border-white/5 text-slate-300 hover:bg-slate-700/50 hover:border-white/10'">
              <span class="font-bold">{{ paper.name }}</span>
              <span class="text-xs opacity-70">{{ paper.description }}</span>
            </button>
          </div>
          <div class="mt-6 pt-4 border-t border-white/10 text-xs text-slate-500 text-center">
            Place more PDFs in <br/><code class="text-slate-400">assets/papers/</code>
          </div>
        </div>

        <!-- Middle: Dropzone & PDF Viewer -->
        <div class="flex-1 flex flex-col p-6 h-full relative" 
             (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
          
          <div *ngIf="isDragging" class="absolute inset-4 z-50 rounded-3xl border-4 border-dashed border-indigo-500 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center">
            <h2 class="text-3xl font-black text-indigo-300 drop-shadow-md">Drop PDF Here</h2>
          </div>

          <!-- Empty State -->
          <div *ngIf="!pdfUrl" class="w-full h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center border-dashed border-2 hover:border-indigo-500/50 transition-colors">
            <div class="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 shadow-inner shadow-indigo-500/20">
              <svg class="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
            </div>
            <h2 class="text-3xl font-bold mb-2">Select or Import Paper</h2>
            <p class="text-slate-400 text-center max-w-md mb-8">
              Select a paper from the library on the left, or drag & drop your own PDF here.
            </p>
            <input type="file" id="pdfUpload" class="hidden" accept="application/pdf" (change)="onFileSelected($event)">
            <label for="pdfUpload" class="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-all border border-white/10 shadow-sm">
              Browse Local Files
            </label>
          </div>

          <!-- PDF Viewer -->
          <div *ngIf="pdfUrl" class="w-full h-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl flex relative">
            <button (click)="clearPdf()" class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-rose-500/80 text-white flex items-center justify-center hover:bg-rose-500 transition-colors shadow-lg backdrop-blur-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <iframe [src]="pdfUrl | safe" class="w-full h-full border-0"></iframe>
          </div>
        </div>

        <!-- Right: Dictionary Sidebar -->
        <div class="w-96 bg-slate-900/80 border-l border-white/10 backdrop-blur-xl h-full flex flex-col p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Dictionary
          </h3>
          
          <div class="relative mb-6">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchDictionary()"
                   placeholder="Search problem words..." 
                   class="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
            <svg class="w-5 h-5 text-slate-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div *ngIf="isSearching" class="flex justify-center py-8">
            <div class="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>

          <div *ngIf="!isSearching && dictionaryResults.length > 0" class="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
            <div *ngFor="let res of dictionaryResults" class="p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
              <h4 class="text-2xl font-bold mb-1">{{ res.japanese[0]?.word || res.japanese[0]?.reading }}</h4>
              <p class="text-sm text-purple-300 font-medium mb-2">{{ res.japanese[0]?.reading }}</p>
              <div class="text-sm text-slate-300 space-y-1">
                <p *ngFor="let sense of res.senses[0]?.english_definitions | slice:0:3">- {{ sense }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="!isSearching && dictionaryResults.length === 0 && hasSearched" class="text-center text-slate-500 py-8">
            No results found.
          </div>
          
          <div *ngIf="!hasSearched" class="text-center text-slate-500 py-8 text-sm px-4">
            Stuck on a word? Type it here or paste from the PDF to get meanings instantly.
          </div>
        </div>

      </main>
    </div>
  `
})
export class PreviousPapersComponent {
  pdfUrl: string | null = null;
  pdfFile: File | null = null;
  isDragging = false;
  isGenerating = false;
  
  searchQuery = '';
  isSearching = false;
  hasSearched = false;
  dictionaryResults: any[] = [];
  
  builtInPapers = [
    { id: 1, name: 'Sample JLPT N5', description: 'Practice Reading Section', filename: 'dummy.pdf' },
    { id: 2, name: 'JLPT N4 Past Paper', description: 'Vocab & Reading', filename: 'n4.pdf' }
  ];
  activePaper: any = null;

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('window:drop', ['$event'])
  onWindowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.activePaper = null;
      this.handleFile(file);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.activePaper = null;
      this.handleFile(event.target.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type === 'application/pdf') {
      this.pdfFile = file;
      const objectUrl = URL.createObjectURL(file);
      this.pdfUrl = objectUrl;
    } else {
      alert('Please upload a valid PDF file.');
    }
  }
  
  async loadBuiltInPaper(paper: any) {
    this.activePaper = paper;
    this.pdfUrl = null; // show loading state briefly
    this.pdfFile = null;
    try {
      const response = await fetch('/assets/papers/' + paper.filename);
      if (!response.ok) {
        alert('Could not load this paper. Ensure it is placed in assets/papers directory.');
        this.activePaper = null;
        return;
      }
      const blob = await response.blob();
      const file = new File([blob], paper.filename, { type: 'application/pdf' });
      this.handleFile(file);
    } catch (e) {
      alert('Failed to fetch the paper.');
      this.activePaper = null;
    }
  }

  clearPdf() {
    this.pdfUrl = null;
    this.pdfFile = null;
    this.activePaper = null;
  }

  async searchDictionary() {
    if (!this.searchQuery.trim()) return;
    
    this.isSearching = true;
    this.hasSearched = true;
    
    try {
      const res = await fetch(`https://isho.org/api/v1/search/words?keyword=\${encodeURIComponent(this.searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        this.dictionaryResults = data.data || [];
      } else {
        // Fallback to real Jisho if local fails
        const jishoRes = await fetch(`https://corsproxy.io/?https://jisho.org/api/v1/search/words?keyword=\${encodeURIComponent(this.searchQuery)}`);
        const data = await jishoRes.json();
        this.dictionaryResults = data.data || [];
      }
    } catch (e) {
      console.error(e);
      try {
        const jishoRes = await fetch(`https://corsproxy.io/?https://jisho.org/api/v1/search/words?keyword=\${encodeURIComponent(this.searchQuery)}`);
        const data = await jishoRes.json();
        this.dictionaryResults = data.data || [];
      } catch (err) {
        console.error('All dictionary APIs failed', err);
      }
    } finally {
      this.isSearching = false;
    }
  }

  generateQuiz() {
    if (!this.pdfFile) return;
    
    this.isGenerating = true;
    this.quizService.generateQuizFromPdf(this.pdfFile).subscribe({
      next: (quizId) => {
        this.isGenerating = false;
        // Navigate to quiz with ID
        this.router.navigate(['/quiz'], { queryParams: { id: quizId } });
      },
      error: (err) => {
        this.isGenerating = false;
        alert('Failed to generate quiz. Make sure the file is not too large and is a valid PDF.');
      }
    });
  }
}
