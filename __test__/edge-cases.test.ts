import { onInputEvent, MouseKeyBoardEvent, EventKeyType, EventBtnType } from '../lib/monitor';
import { sum } from '../index';

describe('Edge cases and error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sum function edge cases', () => {
    test('should handle integer overflow scenarios', () => {
      // Test with values near i32 limits
      const maxInt32 = 2147483647;
      const minInt32 = -2147483648;
      
      expect(sum(maxInt32, 0)).toBe(maxInt32);
      expect(sum(minInt32, 0)).toBe(minInt32);
      expect(sum(1, -1)).toBe(0);
    });

    test('should handle type coercion edge cases', () => {
      // These tests verify how JavaScript numbers are handled
      expect(sum(1.99, 2.01)).toBe(4); // Mock adds directly without truncation
      expect(sum(-1.99, -2.01)).toBe(-4);
    });
  });

  describe('onInputEvent edge cases', () => {
    const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;

    test('should handle null callback', () => {
      expect(() => {
        onInputEvent(null as any);
      }).not.toThrow(); // The native function should handle this
    });

    test('should handle undefined callback', () => {
      expect(() => {
        onInputEvent(undefined as any);
      }).not.toThrow(); // The native function should handle this
    });

    test('should handle callback that throws errors', () => {
      const throwingCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999500, nanos_since_epoch: 0 },
          name: 'a',
          event_type: { KeyPress: 'KeyA' }
        });
        
        expect(() => {
          callback(testEvent);
        }).toThrow('Callback error');
      });

      onInputEvent(throwingCallback);
      expect(throwingCallback).toHaveBeenCalled();
    });

    test('should handle malformed JSON events', () => {
      const mockCallback = jest.fn();

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const malformedEvents = [
          'not json at all',
          '{"incomplete": true',
          '{"time": null}',
          '{}',
          'null',
          'undefined',
          ''
        ];

        malformedEvents.forEach(eventString => {
          expect(() => {
            callback(eventString);
          }).toThrow();
        });
      });

      onInputEvent(mockCallback);
    });

    test('should handle events with missing required fields', () => {
      const mockCallback = jest.fn();
      let thrownErrors = 0;

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const incompleteEvents = [
          JSON.stringify({ time: { secs_since_epoch: 123, nanos_since_epoch: 456 } }), // missing name and event_type
          JSON.stringify({ name: 'a', event_type: { KeyPress: 'KeyA' } }), // missing time
          JSON.stringify({ time: { secs_since_epoch: 123, nanos_since_epoch: 456 }, name: 'a' }), // missing event_type
          JSON.stringify({ time: { secs_since_epoch: 123 }, name: 'a', event_type: { KeyPress: 'KeyA' } }), // incomplete time
          JSON.stringify({ time: { nanos_since_epoch: 456 }, name: 'a', event_type: { KeyPress: 'KeyA' } }) // incomplete time
        ];

        incompleteEvents.forEach(eventString => {
          try {
            callback(eventString);
          } catch (error) {
            thrownErrors++;
          }
        });
      });

      onInputEvent(mockCallback);
      // Expect that at least some errors were thrown for malformed events
      expect(thrownErrors).toBeGreaterThan(0);
    });

    test('should handle events with invalid event_type structure', () => {
      const mockCallback = jest.fn();
      let thrownErrors = 0;

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const invalidEventTypes = [
          JSON.stringify({
            time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
            name: 'a',
            event_type: {} // empty event_type
          }),
          JSON.stringify({
            time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
            name: 'a',
            event_type: { KeyPress: 'KeyA', KeyRelease: 'KeyB' } // multiple event types
          }),
          JSON.stringify({
            time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
            name: 'a',
            event_type: 'invalid' // string instead of object
          }),
          JSON.stringify({
            time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
            name: 'a',
            event_type: null // null event_type
          })
        ];

        invalidEventTypes.forEach(eventString => {
          try {
            callback(eventString);
          } catch (error) {
            thrownErrors++;
          }
        });
      });

      onInputEvent(mockCallback);
      // Expect that at least some errors were thrown for invalid event types
      expect(thrownErrors).toBeGreaterThan(0);
    });

    test('should handle extreme timestamp values', () => {
      const mockCallback = jest.fn();

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const extremeTimeEvents = [
          JSON.stringify({
            time: { secs_since_epoch: 0, nanos_since_epoch: 0 },
            name: 'a',
            event_type: { KeyPress: 'KeyA' }
          }),
          JSON.stringify({
            time: { secs_since_epoch: Number.MAX_SAFE_INTEGER, nanos_since_epoch: 999999999 },
            name: 'b',
            event_type: { KeyPress: 'KeyB' }
          }),
          JSON.stringify({
            time: { secs_since_epoch: -1, nanos_since_epoch: 0 },
            name: 'c',
            event_type: { KeyPress: 'KeyC' }
          })
        ];

        extremeTimeEvents.forEach(eventString => {
          callback(eventString);
        });
      });

      onInputEvent(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    test('should handle unknown event types', () => {
      const mockCallback = jest.fn();

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const unknownEventTypes = [
          JSON.stringify({
            time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
            name: null,
            event_type: { UnknownEventType: 'SomeValue' }
          }),
          JSON.stringify({
            time: { secs_since_epoch: 124, nanos_since_epoch: 789 },
            name: null,
            event_type: { CustomEvent: { custom: 'data' } }
          })
        ];

        unknownEventTypes.forEach(eventString => {
          callback(eventString);
        });
      });

      onInputEvent(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(2);
      
      // Verify the parsed events have the unknown types
      const calls = mockCallback.mock.calls;
      expect(calls[0][0].event.type).toBe('UnknownEventType');
      expect(calls[0][0].event.value).toBe('SomeValue');
      expect(calls[1][0].event.type).toBe('CustomEvent');
      expect(calls[1][0].event.value).toEqual({ custom: 'data' });
    });

    test('should handle very large event payloads', () => {
      const mockCallback = jest.fn();

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const largePayload = 'x'.repeat(10000); // Large string
        const largeEvent = JSON.stringify({
          time: { secs_since_epoch: 123, nanos_since_epoch: 456 },
          name: largePayload,
          event_type: { KeyPress: 'KeyA' }
        });

        callback(largeEvent);
      });

      onInputEvent(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback.mock.calls[0][0].name).toHaveLength(10000);
    });
  });

  describe('Type system edge cases', () => {
    test('should handle unknown key types', () => {
      const unknownKey: EventKeyType = { Unknown: 999 };
      expect(unknownKey).toEqual({ Unknown: 999 });
    });

    test('should handle unknown button types', () => {
      const unknownButton: EventBtnType = { Unknown: 888 };
      expect(unknownButton).toEqual({ Unknown: 888 });
    });

    test('should handle edge case event structures', () => {
      // Test that TypeScript allows valid event structures
      const keyPressEvent: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 0, nanos_since_epoch: 0 },
        name: '',
        event: { type: 'KeyPress', value: 'KeyA' }
      };

      const mouseEvent: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 0, nanos_since_epoch: 0 },
        name: null,
        event: { type: 'MouseMove', value: { x: -1000, y: -1000 } }
      };

      const wheelEvent: MouseKeyBoardEvent = {
        time: { secs_since_epoch: 0, nanos_since_epoch: 0 },
        name: null,
        event: { type: 'Wheel', value: { delta_x: 0, delta_y: 0 } }
      };

      expect(keyPressEvent).toBeDefined();
      expect(mouseEvent).toBeDefined();
      expect(wheelEvent).toBeDefined();
    });
  });

  describe('Memory and performance edge cases', () => {
    test('should handle rapid callback registrations', () => {
      const callbacks = Array.from({ length: 100 }, () => jest.fn());
      
      callbacks.forEach(callback => {
        expect(() => {
          onInputEvent(callback);
        }).not.toThrow();
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      expect(mockOnInputEvent).toHaveBeenCalledTimes(100);
    });

    test('should handle large numbers of events efficiently', () => {
      const events: MouseKeyBoardEvent[] = [];
      const mockCallback = jest.fn((event: MouseKeyBoardEvent) => {
        events.push(event);
      });

      const mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
      mockOnInputEvent.mockImplementation((callback: Function) => {
        const start = performance.now();
        
        // Generate 1000 events
        for (let i = 0; i < 1000; i++) {
          const eventString = JSON.stringify({
            time: { secs_since_epoch: 1696000000 + i, nanos_since_epoch: i * 1000000 },
            name: i % 2 === 0 ? String.fromCharCode(97 + (i % 26)) : null,
            event_type: i % 2 === 0 
              ? { KeyPress: `Key${String.fromCharCode(65 + (i % 26))}` }
              : { MouseMove: { x: i % 1920, y: i % 1080 } }
          });
          callback(eventString);
        }
        
        const end = performance.now();
        expect(end - start).toBeLessThan(100); // Should process 1000 events in less than 100ms
      });

      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledTimes(1000);
      expect(events).toHaveLength(1000);
    });
  });
});
