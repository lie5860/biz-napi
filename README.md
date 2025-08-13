# @lie5860/biz-napi

[![npm version](https://badge.fury.io/js/@lie5860%2Fbiz-napi.svg)](https://badge.fury.io/js/@lie5860%2Fbiz-napi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/lie5860/biz-napi/workflows/CI/badge.svg)](https://github.com/lie5860/biz-napi/actions)

**Language**: English | [简体中文](./README.zh-CN.md)

> A high-performance Node.js native addon for global mouse and keyboard event monitoring

## ✨ Features

- 🚀 **High Performance** - Built with Rust and N-API for optimal speed
- 🖱️ **Mouse Events** - Track clicks, movements, and scroll wheel events
- ⌨️ **Keyboard Events** - Monitor key presses and releases
- 🌍 **Cross Platform** - Works on Windows, macOS, and Linux
- 📦 **Zero Dependencies** - No external runtime dependencies
- 🔒 **Type Safe** - Full TypeScript support with comprehensive type definitions

## 📦 Installation

```bash
npm install @lie5860/biz-napi
```

## 🚀 Quick Start

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

// Start monitoring all input events
onInputEvent((event) => {
  console.log('Event received:', event);
});
```

## 📖 API Reference

### `onInputEvent(callback)`

Starts monitoring global input events and calls the provided callback for each event.

#### Parameters

- `callback` `(event: MouseKeyBoardEvent) => void` - Function to handle input events

#### Event Object Structure

```typescript
interface MouseKeyBoardEvent {
  time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  name: string | null;
  event: {
    type: 'KeyPress' | 'KeyRelease' | 'ButtonPress' | 'ButtonRelease' | 'MouseMove' | 'Wheel';
    value: EventKeyType | EventBtnType | { x: number; y: number } | { delta_x: number; delta_y: number };
  };
}
```

## 📋 Event Types

### Keyboard Events

- **`KeyPress`** - Fired when a key is pressed down
- **`KeyRelease`** - Fired when a key is released

### Mouse Events

- **`ButtonPress`** - Fired when a mouse button is pressed
- **`ButtonRelease`** - Fired when a mouse button is released
- **`MouseMove`** - Fired when the mouse cursor moves
- **`Wheel`** - Fired when the mouse wheel is scrolled

## 💡 Examples

### Basic Event Logging

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  const timestamp = new Date(event.time.secs_since_epoch * 1000);
  console.log(`[${timestamp.toISOString()}] ${event.event.type}:`, event.name || event.event.value);
});
```

### Filtering Specific Events

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  // Only log keyboard events
  if (event.event.type === 'KeyPress' || event.event.type === 'KeyRelease') {
    console.log(`Key ${event.event.type}: ${event.name}`);
  }
  
  // Only log mouse clicks
  if (event.event.type === 'ButtonPress') {
    console.log(`Mouse button clicked: ${event.event.value}`);
  }
});
```

### Mouse Position Tracking

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  if (event.event.type === 'MouseMove') {
    const { x, y } = event.event.value;
    console.log(`Mouse position: (${x}, ${y})`);
  }
});
```

## 🔧 Platform Support

| Platform | Architecture | Status |
|----------|-------------|--------|
| Windows  | x64         | ✅     |
| Windows  | x86         | ✅     |
| macOS    | x64         | ✅     |
| macOS    | ARM64       | ✅     |
| Linux    | x64         | ✅     |

## ⚠️ Security & Permissions

This library requires appropriate permissions to monitor global input events:

- **macOS**: Accessibility permissions may be required
- **Windows**: May require running with elevated privileges for some scenarios
- **Linux**: Access to input devices may be required

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Manual testing
npm run test:manual
```

## 🏗️ Development

```bash
# Build the project
npm run build

# Build in debug mode
npm run build:debug

# Create universal binaries (macOS)
npm run universal
```

## 📄 License

MIT © [lie5860](https://github.com/lie5860)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 [Report Issues](https://github.com/lie5860/biz-napi/issues)
- 💬 [Discussions](https://github.com/lie5860/biz-napi/discussions)
- 📧 [Email Support](mailto:lie5860@example.com)

## 🙏 Acknowledgments

- Built with [napi-rs](https://napi.rs/) - Rust bindings for Node.js
- Powered by [rdev](https://github.com/Narsil/rdev) - Cross-platform input monitoring