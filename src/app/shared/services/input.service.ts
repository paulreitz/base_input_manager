import { Injectable } from '@angular/core';
import { Subject, fromEvent, interval } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { AxisMap, ButtonMap, InputEventType, InputMap } from '../enums/input-event-type';
import { ControlInputEvent } from '../interfaces/input-event';

@Injectable({
    providedIn: 'root',
})
export class InputService {
    private _disconnect$ = new Subject<void>();
    private _inputSource = new Subject<ControlInputEvent>();

    private controllerButtons: number[] = Array(17).fill(0);
    private controllerAxes = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    private axisThreshold = 0.5;
    private fps = 12;
    private controllerIndex = -1;
    private working = false;

    input$ = this._inputSource.asObservable();

    constructor() {
        fromEvent<KeyboardEvent>(document, 'keydown')
            .pipe(
                filter((e: KeyboardEvent) => {
                    return Object.keys(InputMap).includes(e.key);
                }),
                map((e: KeyboardEvent) => {
                    return e.key;
                })
            )
            .subscribe((key: string) => {
                this._inputSource.next({
                    type: InputMap[key],
                    eventEntered: true,
                });
            });

        fromEvent<KeyboardEvent>(document, 'keyup')
            .pipe(
                filter((e: KeyboardEvent) => {
                    return Object.keys(InputMap).includes(e.key);
                }),
                map((e: KeyboardEvent) => {
                    return e.key;
                })
            )
            .subscribe((key: string) => {
                this._inputSource.next({
                    type: InputMap[key],
                    eventEntered: false,
                });
            });

        // @ts-ignore
        fromEvent<GamepadEvent>(window, 'gamepadconnected').subscribe((e: GamepadEvent) => {
            this.controllerIndex = e.gamepad.index;
            this.handleGamepadInput(e.gamepad);
            this.startGamepadLoop();
        });

        // @ts-ignore
        fromEvent<GamepadEvent>(window, 'gamepaddisconnected').subscribe((__e: GamepadEvent) => {
            this._disconnect$.next();
        });
    }

    private handleGamepadInput(gamepad: Gamepad) {
        const buttons = gamepad.buttons.map((button) => {
            return button.value;
        });
        const axes = gamepad.axes.map((axis) => {
            const hasValue = Math.abs(axis) > this.axisThreshold;
            return [hasValue ? 1 : 0, hasValue ? axis : 0];
        });
        this.controllerButtons.forEach((button: number, index: number) => {
            const change = buttons[index] - button;
            if (Math.abs(change)) {
                ButtonMap[index].forEach((type: InputEventType) => {
                    this._inputSource.next({
                        type,
                        eventEntered: change > 0,
                    });
                });
            }
        });
        this.controllerAxes.forEach((axis: number[], index: number) => {
            // TODO: Enter event is correct, but exit event is not - working on a fix.
            const change = axes[index][0] - axis[0];
            if (Math.abs(change)) {
                this._inputSource.next({
                    type: AxisMap[index][change > 0 ? 0 : 1],
                    eventEntered: change > 0,
                });
            }
        });
        this.controllerButtons = buttons.slice();
        this.controllerAxes = axes.slice();
    }

    private startGamepadLoop() {
        interval(1000 / this.fps)
            .pipe(takeUntil(this._disconnect$))
            .subscribe(() => {
                if (!this.working) {
                    this.working = true;
                    if (this.controllerIndex < 0) {
                        this.working = false;
                        return;
                    }
                    const gamepad = navigator.getGamepads()[this.controllerIndex];
                    if (!gamepad) {
                        this.working = false;
                        return;
                    }
                    this.handleGamepadInput(gamepad);
                    this.working = false;
                }
            });
    }
}
