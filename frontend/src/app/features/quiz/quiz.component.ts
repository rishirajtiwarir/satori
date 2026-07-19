import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { QuizService, QuizQuestion } from '../../core/services/quiz.service';
import { SoundService } from '../../core/services/sound.service';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimatedBackgroundComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-x-hidden">
      
      <app-animated-background></app-animated-background>

      <!-- Header -->
      <div class="fixed top-0 left-0 z-50 p-6 md:p-8 flex items-center justify-between w-full bg-gradient-to-b from-slate-950/80 to-transparent">
        <a routerLink="/dashboard" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold transition-all flex items-center gap-2 shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quit Quiz
        </a>
        <div class="text-xl font-black text-indigo-300 tracking-widest drop-shadow-md">
          SCORE: {{ currentScore }}
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-40 flex-1 container mx-auto px-4 md:px-8 pt-32 pb-12 flex flex-col items-center justify-center">
        
        <div *ngIf="!quizComplete && currentQuestion" class="w-full max-w-2xl flex flex-col items-center animate-fade-in-up">
          
          <!-- Question Progress -->
          <div class="text-slate-400 font-bold tracking-widest mb-4">
            QUESTION {{ currentIndex + 1 }} OF {{ questions.length }}
          </div>
          
          <!-- Flashcard -->
          <div class="w-full aspect-[16/9] md:aspect-[2/1] perspective-1000 mb-8 cursor-pointer" (click)="flipCard()">
            <div class="relative w-full h-full transition-transform duration-700 transform-style-3d" [class.rotate-y-180]="isFlipped">
              
              <!-- Front -->
              <div class="absolute w-full h-full backface-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8">
                <h2 class="text-7xl md:text-9xl font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{{ currentQuestion.word }}</h2>
                <p class="text-slate-400 mt-6 text-sm uppercase tracking-widest">Tap to reveal reading</p>
              </div>

              <!-- Back -->
              <div class="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-900/40 backdrop-blur-xl border border-indigo-500/40 rounded-[2rem] shadow-2xl shadow-indigo-500/20 flex flex-col items-center justify-center p-8">
                <h2 class="text-5xl md:text-7xl font-bold text-indigo-100 mb-4">{{ currentQuestion.reading }}</h2>
                <h3 class="text-2xl font-medium text-pink-300">{{ currentQuestion.meaning }}</h3>
              </div>

            </div>
          </div>

          <!-- Multiple Choice Options -->
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <button *ngFor="let option of currentQuestion.options; let i = index" 
                    (click)="selectOption(i)"
                    [disabled]="selectedOption !== null"
                    [ngClass]="{
                      'bg-white/10 hover:bg-white/20': selectedOption === null,
                      'bg-emerald-500/40 border-emerald-500': selectedOption !== null && i === currentQuestion.correctOptionIndex,
                      'bg-rose-500/40 border-rose-500': selectedOption === i && i !== currentQuestion.correctOptionIndex,
                      'opacity-50': selectedOption !== null && i !== currentQuestion.correctOptionIndex && selectedOption !== i
                    }"
                    class="p-6 rounded-2xl border border-white/10 backdrop-blur-md text-xl font-bold transition-all shadow-sm flex items-center justify-center">
              {{ option }}
            </button>
          </div>

        </div>

        <!-- Quiz Complete Screen -->
        <div *ngIf="quizComplete" class="w-full max-w-xl text-center animate-fade-in-up">
          <div class="w-32 h-32 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,165,0,0.5)]">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
          <h1 class="text-5xl font-black mb-4">Quiz Complete!</h1>
          <p class="text-slate-300 text-xl mb-8">You scored <span class="font-bold text-white">{{ currentScore }} XP</span></p>
          
          <div class="flex flex-col gap-4">
            <button (click)="startQuiz()" class="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
              Play Again
            </button>
            <a routerLink="/dashboard" class="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all">
              Return to Dashboard
            </a>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class QuizComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentIndex = 0;
  currentQuestion!: QuizQuestion;
  
  isFlipped = false;
  selectedOption: number | null = null;
  currentScore = 0;
  quizComplete = false;

  constructor(
    private quizService: QuizService,
    private soundService: SoundService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.startQuiz();
  }

  startQuiz() {
    const quizId = this.route.snapshot.queryParamMap.get('id');
    
    if (quizId) {
      this.quizService.getQuizById(Number(quizId)).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.setupQuiz(data);
          } else {
            this.fallbackToMock();
          }
        },
        error: () => this.fallbackToMock()
      });
    } else {
      this.fallbackToMock();
    }
  }

  fallbackToMock() {
    this.quizService.getMockQuizSession(5).subscribe(data => {
      this.setupQuiz(data);
    });
  }

  setupQuiz(data: QuizQuestion[]) {
    this.questions = data;
    this.currentIndex = 0;
    this.currentScore = 0;
    this.quizComplete = false;
    this.loadQuestion();
  }

  loadQuestion() {
    this.currentQuestion = this.questions[this.currentIndex];
    this.isFlipped = false;
    this.selectedOption = null;
  }

  flipCard() {
    if (!this.isFlipped) {
      this.soundService.playFlipSound();
    }
    this.isFlipped = !this.isFlipped;
  }

  selectOption(index: number) {
    if (this.selectedOption !== null) return;
    
    this.selectedOption = index;
    if (index === this.currentQuestion.correctOptionIndex) {
      this.currentScore += 100;
      this.soundService.playCorrectSound();
    } else {
      this.soundService.playIncorrectSound();
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.loadQuestion();
      } else {
        this.quizComplete = true;
        this.soundService.playVictorySound();
        this.quizService.saveScore(this.currentScore);
      }
    }, 1500);
  }
}
