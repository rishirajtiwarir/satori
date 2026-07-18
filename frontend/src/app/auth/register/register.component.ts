import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AboutModalComponent } from '../../shared/components/about-modal/about-modal.component';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AboutModalComponent, AnimatedBackgroundComponent],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-900 relative">
      
      <!-- Persistent Global Logo (Top Left) -->
      <div class="absolute top-0 left-0 z-50 p-6 md:p-8 flex items-center gap-3 w-full">
        <img src="assets/logo_satori.png" alt="Satori Logo" class="w-10 h-10 rounded-2xl shadow-lg shadow-indigo-500/30 object-cover border border-white/10">
        <div class="text-2xl font-black text-white dark:text-white tracking-tight drop-shadow-md hidden md:block">
          Satori
        </div>
        
        <div class="ml-auto mr-4 md:mr-0">
          <button (click)="openAbout()" class="px-4 py-2 rounded-xl bg-slate-900/40 md:bg-white/10 hover:bg-slate-800/60 md:hover:bg-white/20 backdrop-blur-md border border-slate-700/50 md:border-white/10 text-slate-200 md:text-white font-bold transition-all flex items-center gap-2 shadow-sm text-sm">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            How to Use
          </button>
        </div>
      </div>

      <!-- Left Side: Visuals & Features -->
      <div class="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-slate-900 animate-fade-in-left">
        <!-- Global Animated Background (Behind Content) -->
        <div class="absolute inset-0">
          <app-animated-background></app-animated-background>
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-teal-900/40 z-30 pointer-events-none"></div>
        </div>

        <!-- Content Overlay -->
        <div class="relative z-10 p-12 lg:p-24 flex flex-col justify-end h-full text-white w-full animate-fade-in-up">
          <h1 class="text-5xl lg:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
            Start Your Journey.
          </h1>
          <p class="text-xl text-slate-200 mb-10 max-w-lg font-medium leading-relaxed drop-shadow-md">
            Join thousands of students mastering Japanese with the most advanced learning tools available.
          </p>

          <!-- Feature List -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mt-4">
            
            <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-default shadow-xl animate-float" style="animation-delay: 0.2s">
              <div class="text-pink-300 text-3xl font-black">漢</div>
              <div>
                <h3 class="font-bold text-lg">Kanji Mastery</h3>
                <p class="text-sm text-slate-300">Conquer Chinese characters with mnemonics.</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-default shadow-xl animate-float" style="animation-delay: 0.4s">
              <div class="text-emerald-300 text-3xl font-black">文</div>
              <div>
                <h3 class="font-bold text-lg">Grammar Rules</h3>
                <p class="text-sm text-slate-300">Understand particles and sentence structures.</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-default shadow-xl animate-float" style="animation-delay: 0.6s">
              <div class="text-amber-300 text-3xl font-black">🎯</div>
              <div>
                <h3 class="font-bold text-lg">Daily Goals</h3>
                <p class="text-sm text-slate-300">Track your streaks and stay motivated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Register Form -->
      <div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-slate-900 relative animate-fade-in-right">
        
        <div class="w-full max-w-md relative z-10 pt-10 md:pt-0">
          <div class="md:hidden flex items-center gap-3 mb-10">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/30">
              日
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Satori
            </div>
          </div>

          <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Create Account</h2>
          <p class="text-slate-500 dark:text-slate-400 mb-10 font-medium text-lg">Start your Japanese learning journey today.</p>
          
          <div *ngIf="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3 animate-fade-in-up">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-3 animate-fade-in-up">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ successMessage }}
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input type="text" id="name" formControlName="name" 
                     class="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all shadow-sm"
                     placeholder="John Doe">
            </div>
            <div>
              <label for="email" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input type="email" id="email" formControlName="email" 
                     class="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all shadow-sm"
                     placeholder="you@example.com">
            </div>
            <div>
              <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" id="password" formControlName="password"
                     class="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all shadow-sm"
                     placeholder="••••••••">
            </div>
            
            <button type="submit" [disabled]="registerForm.invalid || isLoading"
                    class="w-full py-4 px-4 mt-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30 flex justify-center items-center active:scale-[0.98]">
              <span *ngIf="isLoading" class="mr-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          
          <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p class="text-slate-500 dark:text-slate-400 font-medium">
              Already have an account? 
              <a routerLink="/login" class="font-bold text-pink-600 dark:text-pink-400 hover:text-pink-500 transition-colors ml-1">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- About Modal -->
      <app-about-modal *ngIf="showAbout" (close)="closeAbout()"></app-about-modal>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showAbout = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  openAbout() {
    this.showAbout = true;
  }
  
  closeAbout() {
    this.showAbout = false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'Account created successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 409 || (err.error && err.error.message?.includes('duplicate'))) {
            this.errorMessage = 'Email is already taken.';
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
          console.error('Register error', err);
        }
      });
    }
  }
}
