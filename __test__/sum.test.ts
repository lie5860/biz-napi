import { sum } from '../index';

describe('sum function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic arithmetic', () => {
    test('should add two positive numbers correctly', () => {
      expect(sum(2, 3)).toBe(5);
      expect(sum(10, 20)).toBe(30);
      expect(sum(100, 200)).toBe(300);
    });

    test('should add positive and negative numbers correctly', () => {
      expect(sum(5, -3)).toBe(2);
      expect(sum(-5, 3)).toBe(-2);
      expect(sum(10, -10)).toBe(0);
    });

    test('should add two negative numbers correctly', () => {
      expect(sum(-5, -3)).toBe(-8);
      expect(sum(-10, -20)).toBe(-30);
    });

    test('should handle zero correctly', () => {
      expect(sum(0, 0)).toBe(0);
      expect(sum(0, 5)).toBe(5);
      expect(sum(5, 0)).toBe(5);
      expect(sum(0, -5)).toBe(-5);
    });
  });

  describe('edge cases', () => {
    test('should handle large numbers', () => {
      expect(sum(1000000, 2000000)).toBe(3000000);
      expect(sum(-1000000, 1000000)).toBe(0);
    });

    test('should handle maximum safe integer values', () => {
      const maxInt = 2147483647; // i32 max value
      const minInt = -2147483648; // i32 min value
      
      expect(sum(maxInt, 0)).toBe(maxInt);
      expect(sum(minInt, 0)).toBe(minInt);
      expect(sum(1, -1)).toBe(0);
    });

    test('should handle decimal numbers by adding them directly', () => {
      // Note: The mock function adds the numbers directly without truncation
      expect(sum(1.5 as any, 2.7 as any)).toBe(4.2);
      expect(sum(3.9 as any, 4.1 as any)).toBe(8.0);
    });
  });

  describe('parameter validation', () => {
    test('should be a function', () => {
      expect(typeof sum).toBe('function');
    });

    test('should accept exactly two parameters', () => {
      expect(sum.length).toBe(2);
    });
  });

  describe('performance', () => {
    test('should execute quickly for multiple operations', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        sum(i, i + 1);
      }
      
      const end = performance.now();
      const executionTime = end - start;
      
      // Should complete 1000 operations in less than 50ms
      expect(executionTime).toBeLessThan(50);
    });
  });
});
