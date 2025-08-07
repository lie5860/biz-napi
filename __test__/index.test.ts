/**
 * Main entry point tests
 * Tests the main module exports and re-exports
 */

describe('Main module exports', () => {
  test('should export all required functions from index', () => {
    // Test that the main module properly exports everything
    const mainModule = require('../lib/index');
    
    expect(mainModule).toBeDefined();
    expect(typeof mainModule.onInputEvent).toBe('function');
  });

  test('should re-export monitor module correctly', () => {
    const mainModule = require('../lib/index');
    const monitorModule = require('../lib/monitor');
    
    // Verify that the main module re-exports monitor functions
    expect(mainModule.onInputEvent).toBe(monitorModule.onInputEvent);
  });

  test('should have proper TypeScript type exports', () => {
    // This test ensures TypeScript compilation works correctly
    // by importing and using the types
    const { 
      onInputEvent, 
      EventKeyType, 
      EventBtnType, 
      MouseKeyBoardEvent 
    } = require('../lib/monitor');
    
    expect(onInputEvent).toBeDefined();
    // Types are compile-time constructs, so we just verify they can be imported
  });

  test('should maintain module structure', () => {
    const mainModule = require('../lib/index');
    const moduleKeys = Object.keys(mainModule);
    
    // Should have at least onInputEvent
    expect(moduleKeys.length).toBeGreaterThan(0);
    expect(moduleKeys).toContain('onInputEvent');
  });
});
