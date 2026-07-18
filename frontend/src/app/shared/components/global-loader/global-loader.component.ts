import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.loading$ | async" 
         class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in pointer-events-auto selection:bg-none">
      
      <!-- Ambient Outer Blue Glow -->
      <div class="absolute w-72 h-72 rounded-full bg-blue-600/20 blur-[100px] animate-pulse"></div>
      <div class="absolute w-48 h-48 rounded-full bg-indigo-500/15 blur-[60px] animate-pulse-slow"></div>

      <!-- Centered Loader Container -->
      <div class="relative flex flex-col items-center justify-center">
        
        <!-- Rotating Blue Outer Buffering Ring -->
        <div class="w-36 h-36 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 border-b-blue-600 animate-spin-fast drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
        
        <!-- Counter-rotating Inner Pulsing Ring -->
        <div class="absolute w-44 h-44 rounded-full border-2 border-transparent border-t-cyan-300/40 border-l-blue-400/40 animate-spin-reverse-slow"></div>

        <!-- Satori Center Circle Logo -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="relative w-24 h-24 rounded-full p-1 bg-slate-900 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.4)] overflow-hidden flex items-center justify-center group">
            <img src="assets/logo_satori.png" alt="Satori Logo" 
                 class="w-full h-full rounded-full object-cover animate-pulse-subtle">
          </div>
        </div>

        <!-- Buffering Status Text -->
        <div class="mt-8 flex flex-col items-center gap-2">
          <span class="text-sm font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 uppercase drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
            Loading...
          </span>
          <div class="flex gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-bounce-delay-1 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce-delay-2 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce-delay-3 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-spin-fast {
      animation: spin 1s linear infinite;
    }
    .animate-spin-reverse-slow {
      animation: spinReverse 3s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinReverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    .animate-pulse-subtle {
      animation: pulseSubtle 2s ease-in-out infinite;
    }
    @keyframes pulseSubtle {
      0%, 100% { transform: scale(0.95); opacity: 0.9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    .animate-bounce-delay-1 { animation: bounce 1.4s infinite 0s; }
    .animate-bounce-delay-2 { animation: bounce 1.4s infinite 0.2s; }
    .animate-bounce-delay-3 { animation: bounce 1.4s infinite 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class GlobalLoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
