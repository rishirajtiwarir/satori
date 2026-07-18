import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription, interval } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService implements OnDestroy {
  private apiUrl = `${API_BASE_URL}/api/users/time-spent`;
  
  private timeSpentSubject = new BehaviorSubject<number>(0);
  public timeSpent$ = this.timeSpentSubject.asObservable();
  
  private timerSubscription?: Subscription;
  private syncSubscription?: Subscription;

  constructor(private http: HttpClient) {
    this.initTime();
  }

  private initTime() {
    const savedTime = localStorage.getItem('timeSpent');
    if (savedTime) {
      this.timeSpentSubject.next(parseInt(savedTime, 10));
    }
  }

  startTracking() {
    if (this.timerSubscription) return;
    
    // Read from localStorage to ensure we have the latest after a reload
    this.initTime();

    // Increment every second
    this.timerSubscription = interval(1000).subscribe(() => {
      const newTime = this.timeSpentSubject.value + 1;
      this.timeSpentSubject.next(newTime);
      localStorage.setItem('timeSpent', newTime.toString());
    });

    // Sync to server every 30 seconds
    this.syncSubscription = interval(30000).subscribe(() => {
      this.syncToServer();
    });
  }

  stopTracking() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
      this.syncSubscription = undefined;
    }
    this.syncToServer();
  }

  private syncToServer() {
    const token = localStorage.getItem('token');
    if (!token) return; // Not logged in

    this.http.put(this.apiUrl, { timeSpent: this.timeSpentSubject.value }).subscribe({
      error: (err) => console.error('Failed to sync time spent', err)
    });
  }

  ngOnDestroy() {
    this.stopTracking();
  }
}
