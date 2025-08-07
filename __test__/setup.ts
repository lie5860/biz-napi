// Jest setup file
// Global test configuration and mocks

// Mock the native module since we can't load it in test environment
jest.mock('../index', () => ({
  sum: jest.fn((a: number, b: number) => a + b),
  onInputEvent: jest.fn()
}));

// Extend Jest matchers if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      // Add custom matchers here if needed
    }
  }
}

export {};
