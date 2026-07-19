import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Play a card flip (whoosh/click) sound
  playFlipSound() {
    if (this.audioContext.state === 'suspended') this.audioContext.resume();
    
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // Play a correct answer (ding) sound
  playCorrectSound() {
    if (this.audioContext.state === 'suspended') this.audioContext.resume();

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.type = 'sine';
    // Ding-ding (C6 to E6)
    osc.frequency.setValueAtTime(1046.50, this.audioContext.currentTime); // C6
    osc.frequency.setValueAtTime(1318.51, this.audioContext.currentTime + 0.1); // E6
    
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  // Play an incorrect answer (buzz) sound
  playIncorrectSound() {
    if (this.audioContext.state === 'suspended') this.audioContext.resume();

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  // Play a success/victory sound for finishing quiz
  playVictorySound() {
    if (this.audioContext.state === 'suspended') this.audioContext.resume();

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime + (i * 0.1));
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (i * 0.1) + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.start(this.audioContext.currentTime + (i * 0.1));
      osc.stop(this.audioContext.currentTime + (i * 0.1) + 0.4);
    });
  }

  // Play a welcome speech followed by a chime
  playWelcomeSequence() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Welcome to your Japanese journey. Discover your Satori.");
      msg.lang = 'en-US';
      msg.rate = 0.9; // Slightly slower for dramatic effect
      msg.pitch = 1.1;
      
      msg.onend = () => {
        // Play "Tun tun tana" chime after speech
        this.playWelcomeChime();
      };
      
      window.speechSynthesis.speak(msg);
    } else {
      // Fallback if no speech synthesis
      this.playWelcomeChime();
    }
  }

  private playWelcomeChime() {
    if (this.audioContext.state === 'suspended') this.audioContext.resume();

    // Tun (C5) - Tun (E5) - Tana (G5 -> C6)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.3 },     // Tun (C5)
      { freq: 659.25, time: 0.4, duration: 0.3 },   // Tun (E5)
      { freq: 783.99, time: 0.8, duration: 0.2 },   // Ta (G5)
      { freq: 1046.50, time: 1.0, duration: 0.5 }   // na (C6)
    ];

    notes.forEach(note => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + note.time);
      gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + note.time + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + note.time + note.duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.start(this.audioContext.currentTime + note.time);
      osc.stop(this.audioContext.currentTime + note.time + note.duration);
    });
  }
}
