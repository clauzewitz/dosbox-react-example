import {
    KEY_NUMPAD1,
    KEY_NUMPAD2,
    KEY_NUMPAD3,
    KEY_NUMPAD4,
    KEY_NUMPAD6,
    KEY_NUMPAD7,
    KEY_NUMPAD8,
    KEY_NUMPAD9
} from 'keycode-js';

export enum DIRECTION_TYPE {
    FORWARD = KEY_NUMPAD8,
    BACKWARD = KEY_NUMPAD2,
    LEFT = KEY_NUMPAD4,
    RIGHT = KEY_NUMPAD6,
    LEFT_FORWARD = KEY_NUMPAD7,
    LEFT_BACKWARD = KEY_NUMPAD1,
    RIGHT_FORWARD = KEY_NUMPAD9,
    RIGHT_BACKWARD = KEY_NUMPAD3
}

// ArrowLeft: 100,
// ArrowUp: 104,
// ArrowRight: 102,
// ArrowDown: 98,
// Escape: 27, // Escape
// // Extend
// KeyR: 107, // +
// KeyE: 109, // -
// KeyW: 106, // *
// KeyQ: 111, // /
// // Special
// ArrowLeftDown: 97,
// ArrowRightDown: 99,
// ArrowLeftUp: 103,
// ArrowRightUp: 105,