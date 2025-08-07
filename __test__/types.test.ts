import { 
  EventKeyType, 
  EventBtnType, 
  MouseKeyBoardEvent, 
  MouseKeyBoardEventOther, 
  MouseKeyBoardEventKeyPress 
} from '../lib/monitor';

describe('Type definitions', () => {
  describe('EventKeyType', () => {
    test('should include all expected key types', () => {
      const expectedKeys: EventKeyType[] = [
        'Alt', 'AltGr', 'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight',
        'Delete', 'DownArrow', 'End', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5',
        'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Home', 'LeftArrow',
        'MetaLeft', 'MetaRight', 'PageDown', 'PageUp', 'Return', 'RightArrow',
        'ShiftLeft', 'ShiftRight', 'Space', 'Tab', 'UpArrow', 'PrintScreen',
        'ScrollLock', 'Pause', 'NumLock', 'BackQuote', 'Num1', 'Num2', 'Num3',
        'Num4', 'Num5', 'Num6', 'Num7', 'Num8', 'Num9', 'Num0', 'Minus',
        'Equal', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU',
        'KeyI', 'KeyO', 'KeyP', 'LeftBracket', 'RightBracket', 'KeyA', 'KeyS',
        'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'SemiColon',
        'Quote', 'BackSlash', 'IntlBackslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV',
        'KeyB', 'KeyN', 'KeyM', 'Comma', 'Dot', 'Slash', 'Insert', 'KpReturn',
        'KpMinus', 'KpPlus', 'KpMultiply', 'KpDivide', 'Kp0', 'Kp1', 'Kp2',
        'Kp3', 'Kp4', 'Kp5', 'Kp6', 'Kp7', 'Kp8', 'Kp9', 'KpDelete', 'Function'
      ];

      // Test that each key type can be assigned
      expectedKeys.forEach(key => {
        const testKey: EventKeyType = key;
        expect(typeof testKey).toBe('string');
      });
    });

    test('should support Unknown key type with number', () => {
      const unknownKey: EventKeyType = { Unknown: 123 };
      expect(unknownKey).toEqual({ Unknown: 123 });
    });
  });

  describe('EventBtnType', () => {
    test('should include all expected button types', () => {
      const expectedButtons: EventBtnType[] = ['Left', 'Right', 'Middle'];
      
      expectedButtons.forEach(button => {
        const testButton: EventBtnType = button;
        expect(typeof testButton).toBe('string');
      });
    });

    test('should support Unknown button type with number', () => {
      const unknownButton: EventBtnType = { Unknown: 456 };
      expect(unknownButton).toEqual({ Unknown: 456 });
    });
  });

  describe('MouseKeyBoardEventOther', () => {
    test('should accept KeyRelease events', () => {
      const event: MouseKeyBoardEventOther = {
        time: { secs_since_epoch: 1695999163, nanos_since_epoch: 631148700 },
        name: null,
        event: { type: 'KeyRelease', value: 'KeyA' }
      };

      expect(event.time).toBeDefined();
      expect(event.name).toBeNull();
      expect(event.event.type).toBe('KeyRelease');
      expect(event.event.value).toBe('KeyA');
    });

    test('should accept ButtonPress events', () => {
      const event: MouseKeyBoardEventOther = {
        time: { secs_since_epoch: 1695999164, nanos_since_epoch: 123456789 },
        name: null,
        event: { type: 'ButtonPress', value: 'Left' }
      };

      expect(event.event.type).toBe('ButtonPress');
      expect(event.event.value).toBe('Left');
    });

    test('should accept ButtonRelease events', () => {
      const event: MouseKeyBoardEventOther = {
        time: { secs_since_epoch: 1695999165, nanos_since_epoch: 987654321 },
        name: null,
        event: { type: 'ButtonRelease', value: 'Right' }
      };

      expect(event.event.type).toBe('ButtonRelease');
      expect(event.event.value).toBe('Right');
    });

    test('should accept MouseMove events', () => {
      const event: MouseKeyBoardEventOther = {
        time: { secs_since_epoch: 1695999166, nanos_since_epoch: 111222333 },
        name: null,
        event: { type: 'MouseMove', value: { x: 100, y: 200 } }
      };

      expect(event.event.type).toBe('MouseMove');
      expect(event.event.value).toEqual({ x: 100, y: 200 });
    });

    test('should accept Wheel events', () => {
      const event: MouseKeyBoardEventOther = {
        time: { secs_since_epoch: 1695999167, nanos_since_epoch: 444555666 },
        name: null,
        event: { type: 'Wheel', value: { delta_x: 0, delta_y: -120 } }
      };

      expect(event.event.type).toBe('Wheel');
      expect(event.event.value).toEqual({ delta_x: 0, delta_y: -120 });
    });
  });

  describe('MouseKeyBoardEventKeyPress', () => {
    test('should accept KeyPress events with name', () => {
      const event: MouseKeyBoardEventKeyPress = {
        time: { secs_since_epoch: 1695999168, nanos_since_epoch: 777888999 },
        name: 'a',
        event: { type: 'KeyPress', value: 'KeyA' }
      };

      expect(event.name).toBe('a');
      expect(event.event.type).toBe('KeyPress');
      expect(event.event.value).toBe('KeyA');
    });

    test('should handle special characters', () => {
      const event: MouseKeyBoardEventKeyPress = {
        time: { secs_since_epoch: 1695999169, nanos_since_epoch: 123123123 },
        name: '@',
        event: { type: 'KeyPress', value: 'Num2' }
      };

      expect(event.name).toBe('@');
      expect(event.event.value).toBe('Num2');
    });
  });

  describe('MouseKeyBoardEvent union type', () => {
    test('should accept MouseKeyBoardEventOther', () => {
      const event: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 1695999170, nanos_since_epoch: 456456456 },
        name: null,
        event: { type: 'KeyRelease', value: 'Space' }
      };

      expect(event).toBeDefined();
    });

    test('should accept MouseKeyBoardEventKeyPress', () => {
      const event: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 1695999171, nanos_since_epoch: 789789789 },
        name: 'space',
        event: { type: 'KeyPress', value: 'Space' }
      };

      expect(event).toBeDefined();
    });
  });

  describe('Time structure', () => {
    test('should have correct time structure', () => {
      const event: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 1695999172, nanos_since_epoch: 321321321 },
        name: null,
        event: { type: 'MouseMove', value: { x: 50, y: 75 } }
      };

      expect(typeof event.time.secs_since_epoch).toBe('number');
      expect(typeof event.time.nanos_since_epoch).toBe('number');
      expect(event.time.secs_since_epoch).toBeGreaterThan(0);
      expect(event.time.nanos_since_epoch).toBeGreaterThanOrEqual(0);
      expect(event.time.nanos_since_epoch).toBeLessThan(1000000000); // nanoseconds should be < 1 second
    });
  });
});
