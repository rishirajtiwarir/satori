import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { SenseiService, SenseiChatResponse } from '../../core/services/sensei.service';
import { SpeechService } from '../../core/services/speech.service';

interface ChatMessage {
  sender: 'user' | 'sensei';
  text: string; // User message or Sensei Japanese
  romaji?: string;
  english?: string;
  feedback?: string;
  showDetails?: boolean;
}

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  level: string;
  color: string;
  borderColor: string;
  description: string;
  usefulPhrases: { jp: string; romaji: string; en: string }[];
}

@Component({
  selector: 'app-ai-sensei',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimatedBackgroundComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden">
      <app-animated-background></app-animated-background>

      <!-- Top Navbar -->
      <nav class="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div class="flex items-center gap-4">
          <a routerLink="/dashboard" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:to-white transition-colors">
              Dashboard
            </span>
          </a>
          <span class="text-white/20">/</span>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🌸</span>
            <span class="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
              Sakura Sensei Studio
            </span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold ml-2">Voice AI</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="toggleApiKeyModal()" class="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-pink-500/40 text-slate-300 text-sm font-medium transition-all flex items-center gap-2 hover:bg-slate-800">
            <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            <span>{{ hasCustomKey ? 'Custom API Key Set' : 'AI API Key' }}</span>
          </button>
          <button *ngIf="activeScenario" (click)="exitToHub()" class="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-sm transition-all flex items-center gap-1.5">
            <span>Change Scenario</span>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="relative z-10 flex-grow flex w-full pt-20 h-screen overflow-hidden">
        
        <!-- VIEW 1: SCENARIO SELECTION HUB -->
        <div *ngIf="!activeScenario" class="w-full h-full overflow-y-auto p-6 md:p-12 flex flex-col items-center">
          <div class="max-w-6xl w-full text-center mb-10">
            <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow">
              Step into Japan with <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">Sakura Sensei</span>
            </h1>
            <p class="text-lg text-slate-300 max-w-2xl mx-auto font-normal">
              Immersive Japanese conversation practice for self-learners. Speak with your microphone, listen to native pronunciation, and receive gentle grammar feedback after every message!
            </p>
          </div>

          <!-- Scenario Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pb-16">
            <div *ngFor="let sc of scenarios" 
                 (click)="selectScenario(sc)"
                 class="group relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-7 cursor-pointer hover:border-pink-500/50 hover:shadow-[0_0_35px_rgba(244,114,182,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:scale-[1.02]">
              
              <!-- Ambient background color -->
              <div class="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl transition-opacity duration-300 opacity-20 group-hover:opacity-40" [ngClass]="sc.color"></div>
              
              <div>
                <div class="flex items-center justify-between mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    {{ sc.icon }}
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/10 backdrop-blur">
                    {{ sc.level }}
                  </span>
                </div>

                <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {{ sc.title }}
                </h3>
                <h4 class="text-sm font-semibold text-pink-400/80 mb-3 uppercase tracking-wider">
                  {{ sc.subtitle }}
                </h4>
                <p class="text-slate-400 text-sm leading-relaxed mb-6">
                  {{ sc.description }}
                </p>
              </div>

              <div class="pt-4 border-t border-white/5 flex items-center justify-between text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                <span>Start Practice</span>
                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <svg class="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VIEW 2: ACTIVE LIVE CHAT STUDIO -->
        <div *ngIf="activeScenario" class="w-full h-full flex flex-col md:flex-row overflow-hidden">
          
          <!-- LEFT PANEL: USEFUL PHRASES & HINTS -->
          <div class="w-full md:w-80 lg:w-96 bg-slate-900/80 border-r border-white/10 backdrop-blur-xl h-48 md:h-full flex flex-col p-6 overflow-y-auto shrink-0 shadow-lg">
            <div class="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <span class="text-3xl">{{ activeScenario.icon }}</span>
              <div>
                <h3 class="font-bold text-lg text-white">{{ activeScenario.title }}</h3>
                <span class="text-xs text-pink-400 font-semibold">{{ activeScenario.level }} Practice</span>
              </div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              {{ activeScenario.description }}
            </p>

            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span>💡 Survival Phrases</span>
              <span class="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20 font-normal">Click to use</span>
            </h4>

            <div class="space-y-3">
              <div *ngFor="let phrase of activeScenario.usefulPhrases"
                   class="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group"
                   (click)="usePhrase(phrase.jp)">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-sm text-pink-300 group-hover:text-pink-200">{{ phrase.jp }}</span>
                  <button (click)="playSpeech(phrase.jp); $event.stopPropagation()" class="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white transition-colors title='Listen'">
                    🔊
                  </button>
                </div>
                <div class="text-[11px] font-medium text-slate-400 italic mb-0.5">{{ phrase.romaji }}</div>
                <div class="text-xs text-slate-300">{{ phrase.en }}</div>
              </div>
            </div>
          </div>

          <!-- CENTER PANEL: CHAT STREAM -->
          <div class="flex-grow flex flex-col h-full bg-slate-950/40 relative">
            <!-- Chat Header -->
            <div class="px-6 py-3 bg-slate-900/50 border-b border-white/5 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <span class="text-sm font-semibold text-slate-200">Sakura Sensei is listening & ready</span>
              </div>
              <span class="text-xs text-slate-400">Click 🎙️ to practice speaking or type your reply</span>
            </div>

            <!-- Messages Scroll Box -->
            <div class="flex-grow overflow-y-auto p-6 space-y-6 flex flex-col" id="chat-container">
              <div *ngFor="let msg of messages" class="flex flex-col">
                <!-- User Bubble (Right aligned) -->
                <div *ngIf="msg.sender === 'user'" class="self-end max-w-[80%] bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-3xl rounded-br-sm shadow-md border border-white/10">
                  <p class="text-base font-medium whitespace-pre-wrap">{{ msg.text }}</p>
                </div>

                <!-- Sensei Bubble (Left aligned) -->
                <div *ngIf="msg.sender === 'sensei'" class="self-start max-w-[90%] md:max-w-[80%] flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0 shadow-lg font-bold text-white text-lg">
                    🌸
                  </div>
                  <div class="flex-grow bg-slate-900/90 border border-white/10 rounded-3xl rounded-tl-sm p-5 shadow-xl backdrop-blur">
                    <!-- Audio & Japanese Header -->
                    <div class="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/5">
                      <p class="text-lg md:text-xl font-bold text-white tracking-wide leading-relaxed">{{ msg.text }}</p>
                      <button (click)="playSpeech(msg.text)" class="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 font-semibold text-xs border border-pink-500/30 flex items-center gap-1.5 transition-all shrink-0">
                        <span>🔊 Listen</span>
                      </button>
                    </div>

                    <!-- Romaji & English toggleable area -->
                    <div class="text-sm text-slate-300 space-y-1.5 mb-3">
                      <div class="flex items-start gap-2">
                        <span class="text-[11px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold shrink-0 uppercase mt-0.5">Romaji</span>
                        <span class="text-slate-300 font-normal italic">{{ msg.romaji || '---' }}</span>
                      </div>
                      <div class="flex items-start gap-2">
                        <span class="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0 uppercase mt-0.5">English</span>
                        <span class="text-slate-200 font-medium">{{ msg.english || '---' }}</span>
                      </div>
                    </div>

                    <!-- Mini feedback banner linking to Right Board -->
                    <div *ngIf="msg.feedback" (click)="latestFeedback = msg.feedback" class="p-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-xs text-pink-300 font-medium cursor-pointer hover:bg-pink-500/20 transition-colors flex items-center gap-2">
                      <span class="text-sm">📝</span>
                      <span class="flex-grow line-clamp-1">{{ msg.feedback }}</span>
                      <span class="text-[10px] text-pink-400 uppercase font-bold shrink-0">View on Board ➔</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typing / Thinking Indicator -->
              <div *ngIf="isThinking" class="self-start flex items-center gap-3 p-4">
                <div class="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center animate-spin text-sm">
                  🌸
                </div>
                <span class="text-sm text-pink-300 font-medium animate-pulse">Sakura Sensei is replying & preparing grammar notes...</span>
              </div>
            </div>

            <!-- Input Bar -->
            <div class="p-4 bg-slate-900/90 border-t border-white/10 backdrop-blur shrink-0">
              <div class="flex items-center gap-3 max-w-4xl mx-auto">
                
                <!-- Mic Voice Recognition Button -->
                <button (click)="toggleRecognition()"
                        [ngClass]="isRecording ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50 border-rose-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'"
                        class="w-12 h-12 rounded-2xl border flex items-center justify-center text-xl transition-all shrink-0 title='Speak in Japanese'">
                  {{ isRecording ? '🛑' : '🎙️' }}
                </button>

                <!-- Text Input -->
                <input type="text"
                       [(ngModel)]="currentInput"
                       (keyup.enter)="sendMessage()"
                       [placeholder]="isRecording ? 'Listening to your Japanese pronunciation...' : 'Type your reply in Romaji, Hiragana, or Kanji...'"
                       class="flex-grow px-5 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 focus:outline-none focus:border-pink-500/60 text-white placeholder-slate-500 text-sm font-medium transition-all shadow-inner">
                
                <!-- Send Button -->
                <button (click)="sendMessage()"
                        [disabled]="!currentInput.trim() || isThinking"
                        class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0">
                  <span>Send</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div *ngIf="isRecording" class="text-center text-xs text-rose-400 font-semibold mt-2 animate-bounce">
                🔴 Recording voice... Speak clearly in Japanese! Click stop when done.
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: SENSEI'S FEEDBACK BOARD -->
          <div class="w-full md:w-80 lg:w-96 bg-slate-900/90 border-l border-white/10 backdrop-blur-xl h-64 md:h-full flex flex-col p-6 overflow-y-auto shrink-0 shadow-lg">
            <div class="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/10">
              <span class="text-2xl">📋</span>
              <h3 class="font-extrabold text-lg text-white tracking-wide">Sensei's Coaching Board</h3>
            </div>

            <div *ngIf="!latestFeedback" class="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-white/5 my-auto">
              <div class="text-4xl mb-3 opacity-60">✍️</div>
              <h4 class="text-sm font-bold text-slate-300 mb-1">No feedback yet</h4>
              <p class="text-xs text-slate-400">
                Start conversing with Sakura Sensei! After each message, I will post detailed tips on your vocabulary, sentence structure, and politeness level right here.
              </p>
            </div>

            <div *ngIf="latestFeedback" class="space-y-4">
              <div class="p-5 rounded-3xl bg-gradient-to-b from-pink-950/40 to-slate-900/80 border border-pink-500/30 shadow-lg">
                <div class="flex items-center gap-2 text-xs font-extrabold text-pink-400 uppercase tracking-wider mb-3">
                  <span class="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                  <span>Latest Linguistic Advice</span>
                </div>
                <p class="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                  {{ latestFeedback }}
                </p>
              </div>

              <div class="p-4 rounded-2xl bg-slate-800/40 border border-white/5 text-xs text-slate-400 leading-relaxed">
                <p class="font-bold text-slate-300 mb-1">🎯 Tip for Self-Learners:</p>
                Try reading Sensei's Japanese response aloud at least twice before answering to train your vocal stamina and natural cadence!
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL: CUSTOM API KEY SETTINGS -->
        <div *ngIf="showKeyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div class="max-w-md w-full rounded-3xl bg-slate-900 border border-white/10 p-7 shadow-2xl relative">
            <h3 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span>🔑</span>
              <span>Custom Gemini AI Key</span>
            </h3>
            <p class="text-xs text-slate-300 mb-5 leading-relaxed">
              Our built-in intelligent Sensei simulators always work for all 5 situations! Want <strong class="text-pink-300">unlimited custom AI dialogue generation</strong> powered by Google's latest model? Paste your free Google Studio API key below:
            </p>
            <input type="password"
                   [(ngModel)]="customApiKey"
                   placeholder="AIzaSy... (Paste your Gemini API key here)"
                   class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 focus:outline-none focus:border-pink-500/50 text-white text-sm font-mono mb-6">
            
            <div class="flex items-center justify-end gap-3">
              <button (click)="toggleApiKeyModal()" class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button (click)="saveApiKey()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-pink-500/25">
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  `
})
export class AiSenseiComponent implements OnInit, OnDestroy {
  scenarios: Scenario[] = [
    {
      id: 'ramen_order',
      title: 'Shibuya Izakaya Dining',
      subtitle: 'Ordering Ramen & Dishes',
      icon: '🍜',
      level: 'N5 - N4',
      color: 'bg-amber-500/30',
      borderColor: 'border-amber-500/30',
      description: 'Practice dining out at a traditional Japanese Shibuya restaurant. Order tonkotsu ramen, customize spiciness, and master basic customer politeness!',
      usefulPhrases: [
        { jp: 'とんこつラーメンをください。', romaji: 'Tonkotsu ramen o kudasai.', en: 'Tonkotsu ramen, please.' },
        { jp: '辛くしないでください。', romaji: 'Karaku shinaide kudasai.', en: 'Please do not make it spicy.' },
        { jp: 'お会計をお願いします。', romaji: 'O-kaikei o onegai shimasu.', en: 'The check/bill, please.' }
      ]
    },
    {
      id: 'station_ticket',
      title: 'Shinjuku Train Station',
      subtitle: 'Directions & Ticket Help',
      icon: '🚄',
      level: 'N5 - N4',
      color: 'bg-cyan-500/30',
      borderColor: 'border-cyan-500/30',
      description: 'Navigate the world’s busiest station! Ask train station attendant Sakura where platforms are and how much tickets cost to your target station.',
      usefulPhrases: [
        { jp: '渋谷駅までの切符はいくらですか？', romaji: 'Shibuya-eki made no kippu wa ikura desu ka?', en: 'How much is a ticket to Shibuya station?' },
        { jp: '山手線のホームはどこですか？', romaji: 'Yamanote-sen no hoomu wa doko desu ka?', en: 'Where is the Yamanote Line platform?' },
        { jp: 'どうもありがとうございます。', romaji: 'Doumo arigatou gozaimasu.', en: 'Thank you very much.' }
      ]
    },
    {
      id: 'konbini',
      title: 'Konbini Satori Shopping',
      subtitle: 'Convenience Store Encounters',
      icon: '🍱',
      level: 'N5',
      color: 'bg-emerald-500/30',
      borderColor: 'border-emerald-500/30',
      description: 'Experience rapid convenience store conversations! Learn how to respond when the cashier asks about warming your bento box or plastic bags.',
      usefulPhrases: [
        { jp: 'はい、お弁当を温めてください。', romaji: 'Hai, obentou o atatamete kudasai.', en: 'Yes, please heat up the bento box.' },
        { jp: 'いいえ、レジ袋は結構です。', romaji: 'Iie, rejibukuro wa kekkou desu.', en: 'No, a plastic bag is fine (not needed).' },
        { jp: 'これをください。', romaji: 'Kore o kudasai.', en: 'I will take this one please.' }
      ]
    },
    {
      id: 'job_interview',
      title: 'Tokyo Workplace First Day',
      subtitle: 'Self-Introduction & Keigo',
      icon: '💼',
      level: 'N3 - N2',
      color: 'bg-purple-500/30',
      borderColor: 'border-purple-500/30',
      description: 'Step into formal Japanese corporate culture. Practice your Jikoshoukai (self-introduction) and master polite Keigo honorifics with supervisor Sakura.',
      usefulPhrases: [
        { jp: 'はじめまして、[名前]と申します。', romaji: 'Hajimemashite, [Name] to moushimasu.', en: 'Nice to meet you, I am called [Name].' },
        { jp: 'どうぞよろしくお願いします。', romaji: 'Douzo yoroshiku onegai shimasu.', en: 'Pleased to work with you / Treat me favorably.' },
        { jp: '一生懸命頑張ります。', romaji: 'Isshoukemmei ganbarimasu.', en: 'I will work as hard as I can.' }
      ]
    },
    {
      id: 'free_talk',
      title: 'Free Talk with Sakura',
      subtitle: 'Casual Mentorship & Q&A',
      icon: '💬',
      level: 'All Levels',
      color: 'bg-rose-500/30',
      borderColor: 'border-rose-500/30',
      description: 'Have an open-ended conversation about any Japanese vocabulary, JLPT grammar doubts, or casual everyday small talk with your dedicated teacher!',
      usefulPhrases: [
        { jp: 'こんにちは、元気ですか？', romaji: 'Konnichiwa, genki desu ka?', en: 'Hello, are you doing well?' },
        { jp: 'JLPT N3の勉強をしたいです。', romaji: 'JLPT N3 no benkyou o shitai desu.', en: 'I want to study for JLPT N3.' },
        { jp: 'この単語の意味は何ですか？', romaji: 'Kono tango no imi wa nani desu ka?', en: 'What is the meaning of this word?' }
      ]
    }
  ];

  activeScenario: Scenario | null = null;
  messages: ChatMessage[] = [];
  currentInput: string = '';
  isThinking: boolean = false;
  latestFeedback: string = '';

  showKeyModal: boolean = false;
  customApiKey: string = '';
  hasCustomKey: boolean = false;

  // Speech recognition
  recognition: any = null;
  isRecording: boolean = false;

  constructor(
    private senseiService: SenseiService,
    private speechService: SpeechService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.customApiKey = this.senseiService.getCustomApiKey();
    this.hasCustomKey = !!this.customApiKey;

    this.initSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
    this.speechService.stop();
  }

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ja-JP'; // Listen for Japanese!
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        this.zone.run(() => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            this.currentInput = (this.currentInput + ' ' + transcript).trim();
          }
          this.isRecording = false;
          this.cdr.detectChanges();
        });
      };

      this.recognition.onerror = (event: any) => {
        this.zone.run(() => {
          console.warn('Speech recognition error/cancelled:', event.error);
          this.isRecording = false;
          this.cdr.detectChanges();
        });
      };

      this.recognition.onend = () => {
        this.zone.run(() => {
          this.isRecording = false;
          this.cdr.detectChanges();
        });
      };
    }
  }

  toggleRecognition() {
    if (!this.recognition) {
      alert('Your browser does not support microphone Speech Recognition. Try Google Chrome or Microsoft Edge on Desktop/Android!');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      try {
        this.recognition.start();
        this.isRecording = true;
      } catch (e) {
        console.error('Mic start error:', e);
        this.isRecording = false;
      }
    }
  }

  selectScenario(sc: Scenario) {
    this.activeScenario = sc;
    this.messages = [];
    this.latestFeedback = '';

    // Trigger opening greeting from Sakura Sensei
    this.isThinking = true;
    this.senseiService.sendMessage(sc.id, 'START_INTRO').subscribe({
      next: (res: SenseiChatResponse) => {
        this.isThinking = false;
        const msg: ChatMessage = {
          sender: 'sensei',
          text: res.replyJapanese,
          romaji: res.replyRomaji,
          english: res.replyEnglish,
          feedback: res.grammarFeedback
        };
        this.messages.push(msg);
        this.latestFeedback = res.grammarFeedback;
        this.playSpeech(res.replyJapanese);
      },
      error: (err) => {
        this.isThinking = false;
        console.error('Error starting roleplay:', err);
        // Add manual welcoming msg if API hiccups
        this.messages.push({
          sender: 'sensei',
          text: 'こんにちは！さくら先生です。練習を始めましょう！',
          romaji: 'Konnichiwa! Sakura-sensei desu. Renshuu o hajimemashou!',
          english: 'Hello! I am Sakura Sensei. Let us start practicing!',
          feedback: '🌸 Welcome to ' + sc.title + '! Try typing or speaking your reply.'
        });
      }
    });
  }

  exitToHub() {
    this.activeScenario = null;
    this.speechService.stop();
    if (this.isRecording && this.recognition) {
      this.recognition.stop();
    }
  }

  usePhrase(jpText: string) {
    this.currentInput = jpText;
  }

  sendMessage() {
    if (!this.currentInput.trim() || this.isThinking || !this.activeScenario) return;

    const userText = this.currentInput.trim();
    this.messages.push({ sender: 'user', text: userText });
    this.currentInput = '';
    this.isThinking = true;

    this.senseiService.sendMessage(this.activeScenario.id, userText).subscribe({
      next: (res: SenseiChatResponse) => {
        this.isThinking = false;
        const reply: ChatMessage = {
          sender: 'sensei',
          text: res.replyJapanese,
          romaji: res.replyRomaji,
          english: res.replyEnglish,
          feedback: res.grammarFeedback
        };
        this.messages.push(reply);
        this.latestFeedback = res.grammarFeedback;
        this.playSpeech(res.replyJapanese);
      },
      error: (err) => {
        this.isThinking = false;
        alert('Could not reach Sakura Sensei right now. Please check internet connection or try again.');
      }
    });
  }

  playSpeech(text: string) {
    this.speechService.speak(text);
  }

  toggleApiKeyModal() {
    this.showKeyModal = !this.showKeyModal;
  }

  saveApiKey() {
    this.senseiService.setCustomApiKey(this.customApiKey);
    this.hasCustomKey = !!this.customApiKey.trim();
    this.showKeyModal = false;
    alert(this.hasCustomKey ? 'Custom Gemini API Key applied successfully!' : 'Custom key cleared. Using built-in simulator!');
  }
}
