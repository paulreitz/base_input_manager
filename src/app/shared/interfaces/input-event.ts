import { InputEventType } from '../enums/input-event-type';

export interface ControlInputEvent {
    type: InputEventType;
    eventEntered: boolean;
}
