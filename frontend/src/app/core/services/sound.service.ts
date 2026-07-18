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
}
