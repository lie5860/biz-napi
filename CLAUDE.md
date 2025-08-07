# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node-API (N-API) project that provides global mouse and keyboard event monitoring capabilities. It uses Rust with the `napi-rs` framework to create a native Node.js addon, leveraging the `rdev` crate for cross-platform input event capture.

The main functionality is the `onInputEvent` function which allows JavaScript code to register a callback that receives mouse and keyboard events in real-time.

## Commonly Used Commands

### Building
- `npm run build` - Build the Rust code for production (release mode)
- `npm run build:debug` - Build the Rust code in debug mode
- `npm run postbuild` - Post-processing step after building

### Development
- `npm run artifacts` - Manage build artifacts
- `npm run universal` - Create universal binaries (macOS)
- `npm run prepublishOnly` - Prepare package for publishing (run automatically during npm publish)
- `npm run version` - Handle version management

### Testing
- `npm test` - Run tests (currently just an echo command)

## Code Architecture

### Rust Implementation
- `src/lib.rs` - Main library entry point, exports the `sum` function and `monitor` module
- `src/monitor.rs` - Core functionality for input event monitoring using `rdev` crate
- `Cargo.toml` - Rust dependencies and configuration

### TypeScript/JavaScript Interface
- `lib/index.ts` - Re-exports monitor functionality
- `lib/monitor.ts` - TypeScript definitions and wrapper functions for input events
- `index.js` - Main entry point that handles cross-platform native binding loading
- `index.d.ts` - TypeScript definitions for the exported functions

### Key Components
1. **Input Event Monitoring**: The `on_input_event` function in Rust spawns a thread that listens for input events using `rdev::listen` and passes them to JavaScript via a threadsafe function.
2. **Cross-Platform Support**: The project supports multiple architectures and operating systems (Windows, macOS, Linux).
3. **Event Parsing**: TypeScript code in `lib/monitor.ts` parses raw JSON events from Rust into typed JavaScript objects.
4. **Native Binding Management**: Complex loader in `index.js` handles loading the correct native binary for the current platform.

## Development Notes
- The project uses `rdev` crate forked from a specific GitHub repository with custom serialization features
- Native binaries are built for multiple platforms and architectures
- TypeScript types are manually maintained in separate files rather than generated