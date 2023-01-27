import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    private _logInterval = 500;
    private _message$ = new Subject<string>();

    constructor() {
        this._message$.pipe(throttle(() => interval(this._logInterval))).subscribe((message: string) => {
            console.log(message);
        });
    }

    log(message: string): void {
        this._message$.next(message);
    }
}
