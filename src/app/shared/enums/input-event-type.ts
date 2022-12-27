export enum InputEventType {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    JUMP,
    ATTACK,
    SELECT,
    BACK,
}

export const InputMap: { [key: string]: InputEventType } = {
    ArrowUp: InputEventType.UP,
    ArrowDown: InputEventType.DOWN,
    ArrowLeft: InputEventType.LEFT,
    ArrowRight: InputEventType.RIGHT,
    w: InputEventType.UP,
    s: InputEventType.DOWN,
    a: InputEventType.LEFT,
    d: InputEventType.RIGHT,
    ' ': InputEventType.JUMP,
    Enter: InputEventType.SELECT,
    c: InputEventType.ATTACK,
    Escape: InputEventType.BACK,
};

export const AxisMap = [
    [InputEventType.LEFT, InputEventType.RIGHT],
    [InputEventType.UP, InputEventType.DOWN],
    [InputEventType.LEFT, InputEventType.RIGHT],
    [InputEventType.UP, InputEventType.DOWN],
];

export const ButtonMap = [
    [InputEventType.JUMP, InputEventType.SELECT], // A, X
    [InputEventType.BACK], // B, Circle
    [InputEventType.ATTACK], // X, Square
    [], // Y, Triangle
    [], // L1
    [], // R1
    [], // L2
    [], // R2
    [], // Back, Select
    [], // Start, Start
    [], // L3
    [], // R3
    [InputEventType.UP], // Dpad Up
    [InputEventType.DOWN], // Dpad Down
    [InputEventType.LEFT], // Dpad Left
    [InputEventType.RIGHT], // Dpad Right
];
