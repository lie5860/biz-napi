# Test Suite Documentation

This directory contains comprehensive unit tests for the `@lie5860/biz-napi` JavaScript API.

## Test Structure

### Test Files

- **`setup.ts`** - Jest configuration and global mocks
- **`sum.test.ts`** - Tests for the `sum` function
- **`monitor.test.ts`** - Tests for the `onInputEvent` function and event parsing
- **`types.test.ts`** - Tests for TypeScript type definitions
- **`integration.test.ts`** - Integration tests simulating real-world usage scenarios
- **`index.test.ts`** - Tests for module exports and re-exports
- **`edge-cases.test.ts`** - Edge cases and error handling tests

## Test Coverage

### Sum Function Tests
- Basic arithmetic operations (positive, negative, zero)
- Edge cases (large numbers, integer limits)
- Type coercion and parameter validation
- Performance benchmarks

### Input Event Monitoring Tests
- Event parsing for all supported event types:
  - KeyPress/KeyRelease events
  - ButtonPress/ButtonRelease events
  - MouseMove events
  - Wheel events
- Error handling for malformed JSON
- Callback function validation
- Performance tests for rapid event processing

### Type System Tests
- Validation of all EventKeyType values
- Validation of all EventBtnType values
- MouseKeyBoardEvent interface compliance
- Union type handling

### Integration Tests
- Real-world usage scenarios:
  - Typing sequences
  - Mouse interactions
  - Keyboard shortcuts (Ctrl+C)
- Performance under load
- Event ordering and timing

### Edge Cases
- Invalid input handling
- Memory efficiency
- Error recovery
- Boundary conditions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Philosophy

1. **Comprehensive Coverage**: Tests cover all public APIs, edge cases, and error conditions
2. **Real-world Scenarios**: Integration tests simulate actual usage patterns
3. **Performance Awareness**: Tests include performance benchmarks and load testing
4. **Type Safety**: Tests verify TypeScript type definitions work correctly
5. **Error Resilience**: Tests ensure graceful handling of invalid inputs and error conditions

## Mocking Strategy

Since this is a native Node.js addon, the tests use Jest mocks to simulate the native Rust functions:
- Native functions are mocked in `setup.ts`
- Tests focus on the JavaScript wrapper logic and type handling
- Mock implementations simulate realistic native function behavior

## Test Data

Tests use realistic event data structures that match the actual format produced by the Rust `rdev` crate:

```json
{
  "time": { 
    "secs_since_epoch": 1695999163, 
    "nanos_since_epoch": 631148700 
  },
  "name": "a",
  "event_type": { "KeyPress": "KeyA" }
}
```

## Contributing

When adding new features or modifying existing functionality:

1. Add corresponding test cases
2. Ensure all existing tests pass
3. Maintain test coverage above 90%
4. Include both positive and negative test cases
5. Add performance tests for performance-critical features
