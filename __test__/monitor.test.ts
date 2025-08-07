import { onInputEvent, EventKeyType, EventBtnType, MouseKeyBoardEvent } from '../lib/monitor';

// Mock the native function
jest.mock('../index', () => ({
  onInputEvent: jest.fn()
}));

describe('onInputEvent function', () => {
  let mockOnInputEvent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnInputEvent = require('../index').onInputEvent as jest.Mock;
  });

  describe('function signature', () => {
    test('should be a function', () => {
      expect(typeof onInputEvent).toBe('function');
    });

    test('should accept a callback function parameter', () => {
      expect(onInputEvent.length).toBe(1);
    });
  });

  describe('callback execution', () => {
    test('should call the native onInputEvent with a callback', () => {
      const mockCallback = jest.fn();

      
      onInputEvent(mockCallback);
      
      expect(mockOnInputEvent).toHaveBeenCalledTimes(1);
      expect(mockOnInputEvent).toHaveBeenCalledWith(expect.any(Function));
    });

    test('should handle callback parameter correctly', () => {
      const mockCallback = jest.fn();

      
      // Mock the native function to call the provided callback

      mockOnInputEvent.mockImplementation((callback) => {
        // Simulate calling the callback with a test event
        const testEventString = JSON.stringify({
          time: { secs_since_epoch: 1695999163, nanos_since_epoch: 631148700 },
          name: 'a',
          event_type: { KeyPress: 'KeyA' }
        });
        callback(testEventString);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999163, nanos_since_epoch: 631148700 },
        name: 'a',
        event: { type: 'KeyPress', value: 'KeyA' }
      });
    });
  });

  describe('event parsing', () => {
    test('should parse KeyPress events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999163, nanos_since_epoch: 631148700 },
          name: 'a',
          event_type: { KeyPress: 'KeyA' }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999163, nanos_since_epoch: 631148700 },
        name: 'a',
        event: { type: 'KeyPress', value: 'KeyA' }
      });
    });

    test('should parse KeyRelease events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999164, nanos_since_epoch: 123456789 },
          name: null,
          event_type: { KeyRelease: 'KeyA' }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999164, nanos_since_epoch: 123456789 },
        name: null,
        event: { type: 'KeyRelease', value: 'KeyA' }
      });
    });

    test('should parse ButtonPress events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999165, nanos_since_epoch: 987654321 },
          name: null,
          event_type: { ButtonPress: 'Left' }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999165, nanos_since_epoch: 987654321 },
        name: null,
        event: { type: 'ButtonPress', value: 'Left' }
      });
    });

    test('should parse ButtonRelease events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999166, nanos_since_epoch: 111222333 },
          name: null,
          event_type: { ButtonRelease: 'Right' }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999166, nanos_since_epoch: 111222333 },
        name: null,
        event: { type: 'ButtonRelease', value: 'Right' }
      });
    });

    test('should parse MouseMove events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999167, nanos_since_epoch: 444555666 },
          name: null,
          event_type: { MouseMove: { x: 100, y: 200 } }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999167, nanos_since_epoch: 444555666 },
        name: null,
        event: { type: 'MouseMove', value: { x: 100, y: 200 } }
      });
    });

    test('should parse Wheel events correctly', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999168, nanos_since_epoch: 777888999 },
          name: null,
          event_type: { Wheel: { delta_x: 0, delta_y: -120 } }
        });
        callback(testEvent);
      });
      
      onInputEvent(mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith({
        time: { secs_since_epoch: 1695999168, nanos_since_epoch: 777888999 },
        name: null,
        event: { type: 'Wheel', value: { delta_x: 0, delta_y: -120 } }
      });
    });
  });

  describe('error handling', () => {
    test('should handle invalid JSON gracefully', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        callback('invalid json string');
      });
      
      expect(() => {
        onInputEvent(mockCallback);
      }).toThrow();
    });

    test('should handle missing event_type gracefully', () => {
      const mockCallback = jest.fn();
      

      mockOnInputEvent.mockImplementation((callback) => {
        const testEvent = JSON.stringify({
          time: { secs_since_epoch: 1695999169, nanos_since_epoch: 123456789 },
          name: null
          // missing event_type
        });
        callback(testEvent);
      });
      
      expect(() => {
        onInputEvent(mockCallback);
      }).toThrow();
    });
  });

  describe('multiple callback registrations', () => {
    test('should handle multiple callback registrations', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      // Mock implementation that doesn't call the callback to avoid parse errors
      mockOnInputEvent.mockImplementation(() => {
        // Just track that the function was called
      });
      
      onInputEvent(callback1);
      onInputEvent(callback2);
      
      expect(mockOnInputEvent).toHaveBeenCalledTimes(2);
    });
  });
});
