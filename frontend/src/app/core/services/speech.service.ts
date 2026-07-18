import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface VoiceSettings {
  voiceURI: string | null;
  rate: number;
  pitch: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth: SpeechSynthesis = window.speechSynthesis;
  
  public voices$ = new BehaviorSubject<SpeechSynthesisVoice[]>([]);
  public isSpeaking$ = new BehaviorSubject<boolean>(false);
  
  private settings: VoiceSettings = {
    voiceURI: null,
    rate: 1,
    pitch: 1
  };

  constructor() {
    this.loadSettings();
    
    // Voices are loaded asynchronously in some browsers
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    
    // Initial attempt to load voices (works instantly in some browsers)
    setTimeout(() => this.loadVoices(), 100);
  }

  private loadVoices() {
    let allVoices = this.synth.getVoices();
    // Prioritize Japanese voices but keep others in case user wants to read English text
    const jpVoices = allVoices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
    const otherVoices = allVoices.filter(v => !v.lang.includes('ja') && !v.lang.includes('JP'));
    
    this.voices$.next([...jpVoices, ...otherVoices]);
  }

  private loadSettings() {
    const saved = localStorage.getItem('tts_settings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse TTS settings', e);
      }
    }
  }

  public saveSettings(settings: VoiceSettings) {
    this.settings = settings;
    localStorage.setItem('tts_settings', JSON.stringify(settings));
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    if (!text.trim()) return;

    // Small timeout to fix Chrome cancel bug
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = this.voices$.value;
      if (this.settings.voiceURI && voices.length > 0) {
        const selectedVoice = voices.find(v => v.voiceURI === this.settings.voiceURI);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else if (voices.length > 0) {
        // Fallback to first Japanese voice
        const jpVoice = voices.find(v => v.lang.includes('ja'));
        if (jpVoice) utterance.voice = jpVoice;
      }

      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;

      utterance.onstart = () => this.isSpeaking$.next(true);
      utterance.onend = () => {
        this.isSpeaking$.next(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        this.isSpeaking$.next(false);
        console.error('Speech error', e);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    }, 50);
  }

  public stop() {
    this.synth.cancel();
    this.isSpeaking$.next(false);
  }

  public pause() {
    this.synth.pause();
    this.isSpeaking$.next(false);
  }

  public resume() {
    this.synth.resume();
    this.isSpeaking$.next(true);
  }
}
