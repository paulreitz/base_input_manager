import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputEventType } from './shared/enums/input-event-type';
import { ControlInputEvent } from './shared/interfaces/input-event';
import { InputService } from './shared/services/input.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject<void>();
    constructor(private inputService: InputService) {}

    ngOnInit() {
        this.inputService.input$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((inputEvent: ControlInputEvent) => {
            console.log(InputEventType[inputEvent.type], inputEvent.eventEntered ? 'pressed' : 'released');
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
