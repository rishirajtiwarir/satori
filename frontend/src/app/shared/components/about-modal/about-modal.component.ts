import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in-up p-4" style="animation-duration: 0.3s">
      <div class="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[60px] pointer-events-none"></div>
        
        <button (click)="onClose()" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 class="text-3xl font-black mb-6 relative z-10 text-white flex items-center gap-3">
          <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span *ngIf="aboutTab === 'about'">More Information</span>
          <span *ngIf="aboutTab === 'guide'">How to Use</span>
        </h2>
        
        <!-- Tabs / Navigation -->
        <div class="flex gap-2 mb-6 relative z-10">
          <button (click)="aboutTab = 'about'" [class.bg-white_20]="aboutTab === 'about'" [class.bg-white_5]="aboutTab !== 'about'" class="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/10 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            About
          </button>
          <button (click)="aboutTab = 'guide'" [class.bg-white_20]="aboutTab === 'guide'" [class.bg-white_5]="aboutTab !== 'guide'" class="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/10 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            How to Use
          </button>
        </div>

        <div class="space-y-6 relative z-10 text-slate-300 leading-relaxed overflow-y-auto max-h-[55vh] pr-2 scrollbar-hide">
          
          <!-- ABOUT TAB CONTENT -->
          <ng-container *ngIf="aboutTab === 'about'">
            <!-- About the Website -->
            <div class="bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <h3 class="text-lg font-bold text-rose-400 mb-2">Why Satori?</h3>
              <p class="text-slate-300 mb-4 leading-relaxed">
                Japanese learners often face a common hurdle: <strong>getting stuck on complex Kanjis</strong> while reading passages. Satori is designed specifically to solve this problem!
              </p>
              <p class="text-slate-300 leading-relaxed">
                Our platform provides instantaneous readings, translations, and vocabulary saving functionalities to ensure you maintain your reading flow and learn contextual grammar without opening multiple dictionary tabs.
              </p>
            </div>

            <!-- Author Message Section -->
            <div class="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <span class="text-6xl font-black text-white">創</span>
              </div>
              <h3 class="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Message from the Developer
              </h3>
              <p class="text-slate-300 text-sm leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-1">
                "I am a passionate Engineering graduate specializing in Computer Science and Data Science. Driven by a deep curiosity for emerging technologies and cross-cultural communication, I built Satori to bridge the gap between language barriers and seamless learning. My mission is to craft intuitive, impactful digital experiences that empower users."
              </p>
              
              <div class="mb-4">
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold">Java</span>
                  <span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold">Spring Boot</span>
                  <span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold">Angular</span>
                  <span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold">Data Science</span>
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-200 text-sm font-bold mb-4 shadow-sm shadow-rose-500/10">
                <span>🇯🇵</span> JLPT N3 Level Learner
              </div>
              
              <h4 class="text-sm font-bold text-white mb-2">Let's Connect!</h4>
              <p class="text-xs mb-4 text-indigo-200">If somebody has something to discuss with me, they can reach out to me.</p>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rishiraj2004tiwari@gmail.com" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white font-semibold text-sm hover:scale-[1.02]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Email
                </a>
                <a href="tel:+918103425555" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white font-semibold text-sm hover:scale-[1.02]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  Call
                </a>
              </div>
            </div>
          </ng-container>

          <!-- HOW TO USE TAB CONTENT -->
          <ng-container *ngIf="aboutTab === 'guide'">
            <div class="space-y-4">
              
              <div class="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20">
                <h3 class="text-lg font-bold text-indigo-300 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Passage Reader & Analyzer
                </h3>
                <p class="text-sm text-slate-300">
                  Paste any Japanese document or passage into the text area. The system will magically highlight Kanjis by JLPT level. 
                  <strong class="text-white">Click any word</strong> to see its meaning instantly, and use the <strong class="text-white">Read</strong> button at the top to listen to it being pronounced like a human!
                </p>
              </div>

              <div class="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20">
                <h3 class="text-lg font-bold text-rose-300 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  Dictionary
                </h3>
                <p class="text-sm text-slate-300">
                  Search for words using English, Romaji, or Japanese (Hiragana/Kanji). Get detailed meanings and save words you want to study later.
                </p>
              </div>

              <div class="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                <h3 class="text-lg font-bold text-emerald-300 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  My Vocabulary
                </h3>
                <p class="text-sm text-slate-300">
                  Create custom lists (e.g., "N3 Kanji", "Hard Verbs") and organize your saved vocabulary. You can access this anytime to review the words you found while reading passages.
                </p>
              </div>

              <div class="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20">
                <h3 class="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Settings & Voices
                </h3>
                <p class="text-sm text-slate-300">
                  Click the ⚙️ icon in the dashboard's top menu to change the Voice, Speed, and Pitch of the Passage Reader. Make the reading voice sound exactly the way you want!
                </p>
              </div>
              
            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `
})
export class AboutModalComponent {
  aboutTab: 'about' | 'guide' = 'about';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
