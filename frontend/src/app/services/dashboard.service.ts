import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _isOnDashboard = new BehaviorSubject<boolean>(false);
  isOnDashboard$ = this._isOnDashboard.asObservable();

  setIsOnDashboard(isOnDashboard: boolean) {
    this._isOnDashboard.next(isOnDashboard);
  }

  getIsOnDashboard() {
    return this._isOnDashboard.value;
  }
}
