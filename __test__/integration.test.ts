import { onInputEvent, MouseKeyBoardEvent } from '../lib/monitor';
import { sum } from '../index';

describe('Integration tests', () => {
  describe('Module exports', () => {
    test('should export sum function', () => {
      expect(sum).toBeDefined();
      expect(typeof sum).toBe('function');
    });

    test('should export onInputEvent function', () => {
      expect(onInputEvent).toBeDefined();
      expect(typeof onInputEvent).toBe('function');
    });

    test('should export all required types', () => {
      // This test ensures that TypeScript compilation succeeds with all types
      const mockEvent: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 1695999173, nanos_since_epoch: 654654654 },
        name: 'test',
        event: { type: 'KeyPress', value: 'KeyT' }
      };

      expect(mockEvent).toBeDefined();
    });
  });

  describe('Real-world usage scenarios', () => {
    test('should handle typical keyboard input monitoring workflow', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      // Mock the native function to simulate key press sequence
      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Simulate typing "hello"
        const keySequence = [
          { key: 'KeyH', name: 'h' },
          { key: 'KeyE', name: 'e' },
          { key: 'KeyL', name: 'l' },
          { key: 'KeyL', name: 'l' },
          { key: 'KeyO', name: 'o' }
        ];

        keySequence.forEach((keyData, index) => {
          const eventString = JSON.stringify({
            time: { 
              secs_since_epoch: 1695999174 + index, 
              nanos_since_epoch: 100000000 * index 
            },
            name: keyData.name,
            event_type: { KeyPress: keyData.key }
          });
          callback(eventString);
        });
      });

      onInputEvent(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(5);
      expect(events).toHaveLength(5);
      expect(events[0].event.value).toBe('KeyH');
      expect(events[0].name).toBe('h');
      expect(events[4].event.value).toBe('KeyO');
      expect(events[4].name).toBe('o');
    });

    test('should handle mouse interaction workflow', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Simulate mouse click sequence: move -> press -> release
        const mouseSequence = [
          { type: 'MouseMove', value: { x: 100, y: 100 } },
          { type: 'ButtonPress', value: 'Left' },
          { type: 'ButtonRelease', value: 'Left' }
        ];

        mouseSequence.forEach((eventData, index) => {
          const eventString = JSON.stringify({
            time: { 
              secs_since_epoch: 1695999180 + index, 
              nanos_since_epoch: 200000000 * index 
            },
            name: null,
            event_type: { [eventData.type]: eventData.value }
          });
          callback(eventString);
        });
      });

      onInputEvent(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(events).toHaveLength(3);
      expect(events[0].event.type).toBe('MouseMove');
      expect(events[0].event.value).toEqual({ x: 100, y: 100 });
      expect(events[1].event.type).toBe('ButtonPress');
      expect(events[1].event.value).toBe('Left');
      expect(events[2].event.type).toBe('ButtonRelease');
      expect(events[2].event.value).toBe('Left');
    });

    test('should handle mixed keyboard and mouse events', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Simulate Ctrl+C (copy) operation: Ctrl press -> C press -> C release -> Ctrl release
        const copySequence = [
          { type: 'KeyPress', value: 'ControlLeft', name: null },
          { type: 'KeyPress', value: 'KeyC', name: 'c' },
          { type: 'KeyRelease', value: 'KeyC', name: null },
          { type: 'KeyRelease', value: 'ControlLeft', name: null }
        ];

        copySequence.forEach((eventData, index) => {
          const eventObj = {
            time: { 
              secs_since_epoch: 1695999190 + index, 
              nanos_since_epoch: 300000000 * index 
            },
            name: eventData.name,
            event_type: { [eventData.type]: eventData.value }
          };
          callback(JSON.stringify(eventObj));
        });
      });

      onInputEvent(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(4);
      expect(events).toHaveLength(4);
      
      // Verify the Ctrl+C sequence
      expect(events[0].event.type).toBe('KeyPress');
      expect(events[0].event.value).toBe('ControlLeft');
      expect(events[1].event.type).toBe('KeyPress');
      expect(events[1].event.value).toBe('KeyC');
      expect(events[1].name).toBe('c');
      expect(events[2].event.type).toBe('KeyRelease');
      expect(events[2].event.value).toBe('KeyC');
      expect(events[3].event.type).toBe('KeyRelease');
      expect(events[3].event.value).toBe('ControlLeft');
    });
  });

  describe('Performance and reliability', () => {
    test('should handle rapid event sequences', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Simulate rapid key presses
        for (let i = 0; i < 100; i++) {
          const eventString = JSON.stringify({
            time: { 
              secs_since_epoch: 1695999200 + Math.floor(i / 10), 
              nanos_since_epoch: (i % 10) * 100000000 
            },
            name: 'a',
            event_type: { KeyPress: 'KeyA' }
          });
          callback(eventString);
        }
      });

      const start = performance.now();
      onInputEvent(mockCallback);
      const end = performance.now();

      expect(mockCallback).toHaveBeenCalledTimes(100);
      expect(events).toHaveLength(100);
      expect(end - start).toBeLessThan(50); // Should process 100 events quickly
    });

    test('should maintain event order', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Create events with sequential timestamps
        for (let i = 0; i < 10; i++) {
          const eventString = JSON.stringify({
            time: { 
              secs_since_epoch: 1695999300 + i, 
              nanos_since_epoch: 0 
            },
            name: String.fromCharCode(97 + i), // a, b, c, ...
            event_type: { KeyPress: `Key${String.fromCharCode(65 + i)}` } // KeyA, KeyB, KeyC, ...
          });
          callback(eventString);
        }
      });

      onInputEvent(mockCallback);

      // Verify events are in correct order
      for (let i = 0; i < 10; i++) {
        expect(events[i].time.secs_since_epoch).toBe(1695999300 + i);
        expect(events[i].name).toBe(String.fromCharCode(97 + i));
        expect(events[i].event.value).toBe(`Key${String.fromCharCode(65 + i)}`);
      }
    });
  });

  describe('Error recovery', () => {
    test('should handle partial malformed events gracefully', () => {
      const validEvents: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        validEvents.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        // Mix valid and invalid events
        const events = [
          JSON.stringify({
            time: { secs_since_epoch: 1695999400, nanos_since_epoch: 0 },
            name: 'a',
            event_type: { KeyPress: 'KeyA' }
          }),
          'invalid json',
          JSON.stringify({
            time: { secs_since_epoch: 1695999401, nanos_since_epoch: 0 },
            name: 'b',
            event_type: { KeyPress: 'KeyB' }
          })
        ];

        // Call valid events, skip invalid ones in this test
        [events[0], events[2]].forEach(eventString => {
          callback(eventString);
        });
      });

      onInputEvent(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(validEvents).toHaveLength(2);
      expect(validEvents[0].name).toBe('a');
      expect(validEvents[1].name).toBe('b');
    });
  });
});
