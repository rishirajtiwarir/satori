import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.loading$ | async" 
         class="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
      
      <!-- Outer ambient glow -->
      <div class="absolute w-64 h-64 rounded-full bg-blue-600/10 blur-[80px] animate-pulse"></div>

      <!-- Spinner + Logo wrapper -->
      <div class="relative flex items-center justify-center w-44 h-44">
        
        <!-- SVG Spinner Ring (perfect circle) -->
        <svg class="absolute inset-0 w-full h-full animate-spin-smooth" viewBox="0 0 160 160">
          <!-- Track -->
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(59,130,246,0.1)" stroke-width="6"/>
          <!-- Spinning arc -->
          <circle cx="80" cy="80" r="70" fill="none"
                  stroke="url(#blueGrad)" stroke-width="6"
                  stroke-linecap="round"
                  stroke-dasharray="280"
                  stroke-dashoffset="100"
                  transform="rotate(-90 80 80)"/>
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4"/>
              <stop offset="50%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#818cf8"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- Inner counter-rotating thin ring -->
        <svg class="absolute animate-spin-reverse" viewBox="0 0 160 160"
             style="width:80%;height:80%;top:10%;left:10%;">
          <circle cx="80" cy="80" r="70" fill="none"
                  stroke="rgba(99,102,241,0.3)" stroke-width="2"
                  stroke-linecap="round"
                  stroke-dasharray="80 350"
                  transform="rotate(-90 80 80)"/>
        </svg>

        <!-- Center Logo -->
        <div class="relative z-10 w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.5)] bg-slate-900 flex items-center justify-center">
          <img src="assets/logo_satori.png" alt="Satori" class="w-full h-full object-cover">
        </div>

      </div>

      <!-- Text below -->
      <div class="mt-6 flex flex-col items-center gap-3">
        <span class="text-xs font-bold tracking-[0.3em] text-blue-300 uppercase">Loading</span>
        <div class="flex gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:0s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0.15s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay:0.3s"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin-smooth {
      animation: spin 1.2s linear infinite;
    }
    .animate-spin-reverse {
      animation: spinReverse 2.5s linear infinite;
    }
    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinReverse {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
  `]
})
export class GlobalLoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
