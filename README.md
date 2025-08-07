# `@lie5860/biz-napi`

[![CI](https://github.com/lie5860/biz-napi/actions/workflows/ci.yml/badge.svg)](https://github.com/lie5860/biz-napi/actions/workflows/ci.yml)
[![Test](https://github.com/lie5860/biz-napi/actions/workflows/test.yml/badge.svg)](https://github.com/lie5860/biz-napi/actions/workflows/test.yml)
[![Release](https://github.com/lie5860/biz-napi/actions/workflows/release.yml/badge.svg)](https://github.com/lie5860/biz-napi/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/lie5860/biz-napi/branch/main/graph/badge.svg)](https://codecov.io/gh/lie5860/biz-napi)
[![npm version](https://badge.fury.io/js/@lie5860%2Fbiz-napi.svg)](https://badge.fury.io/js/@lie5860%2Fbiz-napi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 功能介绍

本项目是一个 Node.js 原生模块，提供了监听键盘和鼠标事件的功能。通过 `onInputEvent` 函数，您可以监听并处理各种输入事件。

## 安装

```bash
npm install @lie5860/biz-napi
```

## 使用方法

### onInputEvent: 键鼠事件监听

监听键盘和鼠标输入事件。

#### 入参示例

```js
(event: MouseKeyBoardEvent) => void;
```

- callback: function 监听输入事件的函数

#### event object 示例

```json
{
  "time": { "secs_since_epoch": 1695999163, "nanos_since_epoch": 631148700 }, // 触发时间
  "name": "a", // 输入内容
  "event": { 
    "type":"KeyPress", // 事件类型
    "value": "KeyA" // 事件值
  } 
}
```

#### 事件类型说明

- `KeyPress`: 键盘按键按下事件
- `KeyRelease`: 键盘按键释放事件
- `ButtonPress`: 鼠标按键按下事件
- `ButtonRelease`: 鼠标按键释放事件
- `MouseMove`: 鼠标移动事件
- `Wheel`: 鼠标滚轮事件

#### 示例代码

```js
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  console.log('Received event:', event);
});
```

## 🔧 开发

### 环境要求

- Node.js >= 16
- Rust (latest stable)
- 支持的平台：macOS, Windows, Linux

### 本地开发

```bash
# 克隆项目
git clone https://github.com/lie5860/biz-napi.git
cd biz-napi

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test

# 运行测试（带覆盖率）
npm run test:coverage

# 监听模式测试
npm run test:watch
```

### 测试

本项目包含完整的测试套件，覆盖率达到 100%：

- **单元测试：** 测试所有 API 函数
- **集成测试：** 测试真实使用场景
- **类型测试：** 验证 TypeScript 类型定义
- **性能测试：** 确保性能符合要求
- **边界测试：** 测试错误处理和边界情况

## 🚀 CI/CD

### 自动化流程

- **持续集成：** 每次 push 和 PR 都会触发完整的测试和构建
- **自动发布：** 版本号变更时自动发布到 NPM
- **多平台构建：** 支持 macOS、Windows、Linux 多平台
- **依赖更新：** Dependabot 自动管理依赖更新

### 发布流程

1. 更新版本号：`npm version patch/minor/major`
2. 推送到 main 分支：`git push origin main`
3. CI 自动执行测试、构建和发布

### 手动触发

也可以通过 GitHub Actions 手动触发发布：
- 支持指定版本号
- 支持 dry-run 模式预览

## 📊 质量保证

- ✅ **100% 测试覆盖率**
- ✅ **TypeScript 类型安全**
- ✅ **多平台兼容性**
- ✅ **性能基准测试**
- ✅ **安全漏洞扫描**
- ✅ **自动化 linting**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 开启 Pull Request

### 贡献指南

- 确保所有测试通过
- 保持代码覆盖率 100%
- 遵循现有代码风格
- 添加必要的测试用例
- 更新相关文档

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。