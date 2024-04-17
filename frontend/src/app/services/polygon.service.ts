import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {
  private polygonSubject = new BehaviorSubject<string>('');
  polygon$ = this.polygonSubject.asObservable();

  constructor() { }

  setPolygon(polygon: string) {
    this.polygonSubject.next(polygon);
  }

  getPolygon() {
    return this.polygonSubject.value;
  }
}
