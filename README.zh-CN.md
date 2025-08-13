# @lie5860/biz-napi

[![npm version](https://badge.fury.io/js/@lie5860%2Fbiz-napi.svg)](https://badge.fury.io/js/@lie5860%2Fbiz-napi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/lie5860/biz-napi/workflows/CI/badge.svg)](https://github.com/lie5860/biz-napi/actions)

**语言**: [English](./README.md) | 简体中文

> 高性能的 Node.js 原生插件，用于全局鼠标和键盘事件监听

## ✨ 特性

- 🚀 **高性能** - 使用 Rust 和 N-API 构建，性能卓越
- 🖱️ **鼠标事件** - 跟踪点击、移动和滚轮事件
- ⌨️ **键盘事件** - 监听按键按下和释放
- 🌍 **跨平台** - 支持 Windows、macOS 和 Linux
- 📦 **零依赖** - 无外部运行时依赖
- 🔒 **类型安全** - 完整的 TypeScript 支持和类型定义

## 📦 安装

```bash
npm install @lie5860/biz-napi
```

## 🚀 快速开始

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

// 开始监听所有输入事件
onInputEvent((event) => {
  console.log('收到事件:', event);
});
```

## 📖 API 参考

### `onInputEvent(callback)`

开始监听全局输入事件，并为每个事件调用提供的回调函数。

#### 参数

- `callback` `(event: MouseKeyBoardEvent) => void` - 处理输入事件的函数

#### 事件对象结构

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

## 📋 事件类型

### 键盘事件

- **`KeyPress`** - 按键按下时触发
- **`KeyRelease`** - 按键释放时触发

### 鼠标事件

- **`ButtonPress`** - 鼠标按键按下时触发
- **`ButtonRelease`** - 鼠标按键释放时触发
- **`MouseMove`** - 鼠标光标移动时触发
- **`Wheel`** - 鼠标滚轮滚动时触发

## 💡 使用示例

### 基础事件记录

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  const timestamp = new Date(event.time.secs_since_epoch * 1000);
  console.log(`[${timestamp.toISOString()}] ${event.event.type}:`, event.name || event.event.value);
});
```

### 过滤特定事件

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  // 只记录键盘事件
  if (event.event.type === 'KeyPress' || event.event.type === 'KeyRelease') {
    console.log(`按键 ${event.event.type}: ${event.name}`);
  }
  
  // 只记录鼠标点击
  if (event.event.type === 'ButtonPress') {
    console.log(`鼠标按键点击: ${event.event.value}`);
  }
});
```

### 鼠标位置跟踪

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  if (event.event.type === 'MouseMove') {
    const { x, y } = event.event.value;
    console.log(`鼠标位置: (${x}, ${y})`);
  }
});
```

### 热键检测

```javascript
import { onInputEvent } from '@lie5860/biz-napi';

let ctrlPressed = false;

onInputEvent((event) => {
  // 跟踪 Ctrl 键状态
  if (event.event.value === 'ControlLeft' || event.event.value === 'ControlRight') {
    ctrlPressed = event.event.type === 'KeyPress';
  }
  
  // 检测 Ctrl+C 组合键
  if (ctrlPressed && event.event.type === 'KeyPress' && event.event.value === 'KeyC') {
    console.log('检测到 Ctrl+C 快捷键！');
  }
});
```

## 🔧 平台支持

| 平台     | 架构    | 状态 |
|----------|---------|------|
| Windows  | x64     | ✅   |
| Windows  | x86     | ✅   |
| macOS    | x64     | ✅   |
| macOS    | ARM64   | ✅   |
| Linux    | x64     | ✅   |

## ⚠️ 安全性和权限

此库需要适当的权限来监听全局输入事件：

- **macOS**: 可能需要辅助功能权限
- **Windows**: 某些场景下可能需要以管理员权限运行
- **Linux**: 可能需要访问输入设备的权限

## 🧪 测试

```bash
# 运行测试
npm test

# 监视模式运行测试
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage

# 手动测试
npm run test:manual
```

## 🏗️ 开发

```bash
# 构建项目
npm run build

# 调试模式构建
npm run build:debug

# 创建通用二进制文件 (macOS)
npm run universal
```

## 📄 许可证

MIT © [lie5860](https://github.com/lie5860)

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 此仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📞 支持

- 🐛 [报告问题](https://github.com/lie5860/biz-napi/issues)
- 💬 [讨论区](https://github.com/lie5860/biz-napi/discussions)
- 📧 [邮件支持](mailto:lie5860@example.com)

## 🙏 致谢

- 使用 [napi-rs](https://napi.rs/) 构建 - Node.js 的 Rust 绑定
- 基于 [rdev](https://github.com/Narsil/rdev) - 跨平台输入监听库

## 📚 更多资源

- [API 文档](https://github.com/lie5860/biz-napi/wiki)
- [常见问题](https://github.com/lie5860/biz-napi/wiki/FAQ)
- [最佳实践](https://github.com/lie5860/biz-napi/wiki/Best-Practices)
- [性能优化指南](https://github.com/lie5860/biz-napi/wiki/Performance)