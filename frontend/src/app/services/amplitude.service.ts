import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AmplitudeService {
    public amplitudeData = new BehaviorSubject({}); // Initial value
    currentAmplitudeData = this.amplitudeData.asObservable();

    constructor() { }

    updateAmplitudeData() {
        this.amplitudeData.next({});
    }
}