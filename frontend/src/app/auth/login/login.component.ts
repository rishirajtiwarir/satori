import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AboutModalComponent } from '../../shared/components/about-modal/about-modal.component';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { SoundService } from '../../core/services/sound.service';
import { SpeechService } from '../../core/services/speech.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AboutModalComponent, AnimatedBackgroundComponent],
  template: `
    <div class="min-h-screen flex flex-col relative bg-slate-950 overflow-hidden">
      
      <!-- Global Animated Background (Behind Everything) -->
      <div class="absolute inset-0 z-0">
        <app-animated-background></app-animated-background>
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-30 pointer-events-none"></div>
      </div>

      <!-- Persistent Global Logo & Nav -->
      <div class="absolute top-0 left-0 z-50 p-6 md:p-8 flex items-center gap-3 w-full">
        <img src="assets/logo_satori.png" alt="Satori Logo" class="w-10 h-10 rounded-2xl shadow-lg shadow-indigo-500/30 object-cover border border-white/10">
        <div class="text-2xl font-black text-white tracking-tight drop-shadow-md">
          Satori
        </div>
        
        <div class="ml-auto">
          <button (click)="openAbout()" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold transition-all flex items-center gap-2 shadow-sm text-sm">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            How to Use
          </button>
        </div>
      </div>

      <!-- Centered Form Container -->
      <div class="relative z-40 flex-1 flex items-center justify-center p-6 w-full h-full" [class.pointer-events-none]="step === 'animating'">
        
        <div class="w-full max-w-md relative h-[300px] flex flex-col justify-center perspective-1000">
          
          <!-- Shared Error/Success Messages -->
          <div class="absolute -top-20 w-full z-50">
            <div *ngIf="errorMessage" class="mb-4 p-4 rounded-xl bg-red-500/80 backdrop-blur-md border border-red-500/50 text-white text-sm font-medium flex items-center gap-3 animate-fade-in-up shadow-lg">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {{ errorMessage }}
            </div>
          </div>

          <form [formGroup]="loginForm" class="w-full relative h-[300px]">

            <!-- STEP 1: EMAIL ALONE -->
            <div *ngIf="step === 'email'" 
                 class="absolute inset-0 w-full flex flex-col justify-center"
                 [class.animate-slide-in-right-slow]="!animatingOutEmail"
                 [class.animate-slide-out-left]="animatingOutEmail">
              
              <h2 class="text-3xl font-black text-white mb-6 text-center tracking-tight drop-shadow-md">Enter your email</h2>
              
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <!-- Notice no "Submit" button here, we rely on the enter key! -->
                <input type="email" id="email" formControlName="email" (keydown.enter)="nextStep()"
                       class="w-full pl-12 pr-5 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] text-xl"
                       placeholder="you@example.com" autocomplete="email" autofocus>
              </div>
              <p class="text-center text-slate-400 text-sm mt-3">Press Enter to continue</p>

              <div class="mt-8 text-center">
                <p class="text-slate-300 font-medium">
                  If you don't have an account, 
                  <a routerLink="/register" class="font-bold text-rose-400 hover:text-rose-300 transition-colors ml-1 border-b border-rose-400/30">create an account</a>
                </p>
              </div>
            </div>

            <!-- STEP 2: PASSWORD ALONE -->
            <div *ngIf="step === 'password'" 
                 class="absolute inset-0 w-full flex flex-col justify-center"
                 [class.animate-slide-in-right-slow]="!animatingOutPassword"
                 [class.animate-slide-out-left]="animatingOutPassword">
              
              <button type="button" (click)="prevStep()" class="absolute -top-12 left-0 text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                 Back
              </button>

              <h2 class="text-3xl font-black text-white mb-2 text-center tracking-tight drop-shadow-md">Enter your password</h2>
              <p class="text-slate-300 mb-6 text-center text-sm font-medium">{{ loginForm.get('email')?.value }}</p>
              
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input type="password" id="password" formControlName="password" (keydown.enter)="onSubmit()"
                       class="w-full pl-12 pr-5 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] text-xl"
                       placeholder="••••••••" autocomplete="current-password">
              </div>
              <p class="text-center text-slate-400 text-sm mt-3">Press Enter to sign in</p>

              <div class="mt-6 flex justify-between items-center px-2">
                <a href="#" class="text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors">Forgot password?</a>
                <a routerLink="/register" class="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Create account</a>
              </div>
            </div>
            
          </form>
        </div>
      </div>

      <!-- STEP 3: PURE CSS CINEMATIC STARTUP LOGO ANIMATION -->
      <div *ngIf="step === 'animating'" class="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        
        <!-- Glowing Ambient Portals -->
        <div class="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div class="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-slow"></div>

        <!-- Logo Container with SVG Spinner -->
        <div class="relative flex flex-col items-center justify-center z-10">
          
          <!-- SVG Spinner Ring wrapper -->
          <div class="relative flex items-center justify-center w-52 h-52">

            <!-- Outer Spinning Arc (Blue Gradient) -->
            <svg class="absolute inset-0 w-full h-full animate-spin-smooth" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(59,130,246,0.12)" stroke-width="5"/>
              <circle cx="80" cy="80" r="70" fill="none"
                      stroke="url(#loginBlueGrad)" stroke-width="5"
                      stroke-linecap="round"
                      stroke-dasharray="280"
                      stroke-dashoffset="100"
                      transform="rotate(-90 80 80)"/>
              <defs>
                <linearGradient id="loginBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#06b6d4"/>
                  <stop offset="50%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#818cf8"/>
                </linearGradient>
              </defs>
            </svg>

            <!-- Inner Counter-rotating thin ring -->
            <svg class="absolute animate-spin-reverse" viewBox="0 0 160 160"
                 style="width:85%;height:85%;top:7.5%;left:7.5%;">
              <circle cx="80" cy="80" r="70" fill="none"
                      stroke="rgba(99,102,241,0.25)" stroke-width="2"
                      stroke-linecap="round"
                      stroke-dasharray="90 350"
                      transform="rotate(-90 80 80)"/>
            </svg>

            <!-- Center Logo (circular, glowing) -->
            <div class="relative z-10 w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.6)] bg-slate-900">
              <img src="assets/logo_satori.png" alt="Satori Logo" class="w-full h-full object-cover">
            </div>
          </div>
          
          <!-- Text Sequence -->
          <div class="mt-6 text-center animate-text-fade-in">
            <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 tracking-[0.3em] pl-[0.3em] drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              SATORI
            </h1>
            
            <p class="mt-3 text-lg md:text-xl font-medium text-slate-300 tracking-[0.2em] opacity-80">
              悟りへようこそ
            </p>
            
            <div class="mt-8 flex justify-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-loading-dot-1"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-loading-dot-2"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-loading-dot-3"></span>
            </div>
          </div>
        </div>

        <!-- Final White Flash overlay -->
        <div class="absolute inset-0 bg-white/10 opacity-0 animate-intro-flash pointer-events-none mix-blend-overlay"></div>
      </div>
      
      <!-- About Modal -->
      <app-about-modal *ngIf="showAbout" (close)="closeAbout()"></app-about-modal>
    </div>
  `,
  styles: [`
    .animate-slide-in-right-slow {
      animation: slideInRight 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .animate-slide-out-left {
      animation: slideOutLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes slideInRight {
      0% { transform: translateX(100vw); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutLeft {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(-100vw); opacity: 0; }
    }
    
    .animate-spin-smooth {
      animation: spinSmooth 1.2s linear infinite;
    }
    .animate-spin-reverse {
      animation: spinReverse 2.5s linear infinite;
    }
    @keyframes spinSmooth {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinReverse {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    
    .animate-text-fade-in {
      animation: textFadeIn 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes textFadeIn {
      0% { opacity: 0; transform: translateY(15px); }
      40% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .animate-loading-dot-1 { animation: loadingDot 1.2s infinite 0s; }
    .animate-loading-dot-2 { animation: loadingDot 1.2s infinite 0.2s; }
    .animate-loading-dot-3 { animation: loadingDot 1.2s infinite 0.4s; }
    @keyframes loadingDot {
      0%, 100% { transform: translateY(0); opacity: 0.3; }
      50% { transform: translateY(-5px); opacity: 1; }
    }
    
    .animate-intro-flash {
      animation: introFlash 3.5s ease-in-out forwards;
    }
    @keyframes introFlash {
      0% { opacity: 0; }
      75% { opacity: 0; }
      90% { opacity: 1; }
      100% { opacity: 1; }
    }
    
    .animate-pulse-slow {
      animation: pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }

    @keyframes fadeInUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    .perspective-1000 {
      perspective: 1000px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showAbout = false;
  errorMessage = '';
  
  step: 'email' | 'password' | 'animating' = 'email';
  animatingOutEmail = false;
  animatingOutPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private soundService: SoundService,
    private speechService: SpeechService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
    
    setTimeout(() => {
      document.getElementById('email')?.focus();
    }, 1500); 
  }

  nextStep() {
    if (this.loginForm.get('email')?.valid) {
      this.errorMessage = '';
      this.animatingOutEmail = true;
      setTimeout(() => {
        this.step = 'password';
        this.animatingOutEmail = false; 
        setTimeout(() => document.getElementById('password')?.focus(), 1500); 
      }, 800); 
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }
  
  prevStep() {
    this.step = 'email';
    this.loginForm.get('password')?.setValue('');
    setTimeout(() => document.getElementById('email')?.focus(), 1500);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Trigger Slide Out Left for Password
          this.animatingOutPassword = true;
          
          setTimeout(() => {
            this.step = 'animating';
            
            // Wait a tiny bit for the animation to start, then speak
            setTimeout(() => {
              // The SpeechService automatically picks the Japanese voice (from settings/fallback)
              this.speechService.speak("Welcome to your Japanese journey. Discover your Satori.", () => {
                // When speaking ends, play the chime
                this.soundService.playWelcomeChime();
              });
            }, 500);

            // Redirect after 4 seconds of animation (give enough time for voice + chime)
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 4000);
          }, 800);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password.';
        }
      });
    } else {
      this.errorMessage = 'Please enter your password.';
    }
  }

  openAbout() {
    this.showAbout = true;
  }
  
  closeAbout() {
    this.showAbout = false;
  }
}
