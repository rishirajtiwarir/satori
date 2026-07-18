import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Netflix Style 1-to-1 Background Slider -->
    <div class="fixed inset-0 w-full h-full z-0 bg-slate-950 overflow-hidden select-none pointer-events-none">
      
      <!-- Background Images -->
      <div *ngFor="let img of backgrounds; let i = index" 
           class="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
           [ngClass]="{'opacity-60 z-10': currentBgIndex === i, 'opacity-0 z-0': currentBgIndex !== i}">
        <img [src]="img" class="w-[120%] h-[120%] -top-[10%] -left-[10%] absolute object-cover filter contrast-[1.1] saturate-[1.2]"
             [ngClass]="{'animate-pan-right': currentBgIndex === i}">
      </div>
      
      <!-- Authentic Japanese Geometric Overlay (Seigaiha inspired texture) -->
      <div class="absolute inset-0 z-15 pointer-events-none opacity-[0.06] mix-blend-overlay"
           style="background-image: url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E');">
      </div>

      <!-- Vignette and Gradients for text readability -->
      <div class="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      <div class="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/70 via-transparent to-transparent"></div>
      
      <!-- Glowing Light Rays from Top Left -->
      <div class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-radial from-rose-500/20 to-transparent blur-[100px] z-20 pointer-events-none transform -rotate-45"></div>
    </div>

    <!-- Magical Fireflies / Glowing Dust -->
    <div *ngIf="showFireflies" class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]" 
           class="absolute firefly" 
           [style.left.%]="(i * 7) % 100" 
           [style.animationDelay.s]="(i * 0.8) % 15"
           [style.animationDuration.s]="12 + (i % 8)">
      </div>
    </div>

    <!-- Falling Sakura Petals -->
    <div *ngIf="showSakura" class="fixed top-0 right-0 w-full md:w-1/2 h-full pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12]" 
           class="absolute sakura-petal" 
           [style.left.%]="100 - (i * 8)" 
           [style.animationDelay.s]="(i * 1.3) % 7"
           [style.animationDuration.s]="8 + (i % 6)">
      </div>
    </div>
  `,
  styles: [`
    @keyframes float-up {
      0% { transform: translateY(100vh) scale(0) rotate(0deg); opacity: 0; }
      20% { opacity: 0.8; }
      80% { opacity: 0.5; }
      100% { transform: translateY(-100px) scale(1) rotate(360deg); opacity: 0; }
    }
    .firefly {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #ffd700;
      box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.6), 0 0 20px 4px rgba(255, 69, 0, 0.4);
      bottom: -20px;
      animation: float-up 15s linear infinite;
      opacity: 0;
    }
    @keyframes fall {
      0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.7; }
      100% { transform: translate(-300px, 100vh) rotate(720deg); opacity: 0; }
    }
    .sakura-petal {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, #ffb7c5, #ff8da1);
      border-radius: 12px 0 12px 0;
      top: -20px;
      animation: fall 10s linear infinite;
      opacity: 0;
      box-shadow: 0 0 10px rgba(255, 183, 197, 0.6);
    }
    @keyframes pan-right {
      0% { transform: scale(1.05) translate(0, 0); }
      100% { transform: scale(1.1) translate(-2%, 1%); }
    }
    .animate-pan-right {
      animation: pan-right 10s ease-out forwards;
    }
  `]
})
export class AnimatedBackgroundComponent implements OnInit, OnDestroy {
  @Input() showSakura: boolean = true;
  @Input() showFireflies: boolean = true;
  
  backgrounds = [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop', // Kyoto street night
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2000&auto=format&fit=crop', // Sakura temple
    'https://images.unsplash.com/photo-1522850959516-58f958d43897?q=80&w=2000&auto=format&fit=crop', // Tokyo neon
    'https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=2000&auto=format&fit=crop'  // Fuji sunset
  ];
  currentBgIndex = 0;
  private bgInterval: any;

  ngOnInit() {
    this.bgInterval = setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgrounds.length;
    }, 8000); // Change image every 8 seconds
  }

  ngOnDestroy() {
    if (this.bgInterval) {
      clearInterval(this.bgInterval);
    }
  }
}
