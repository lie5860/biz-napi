# biz-napi 测试指南

本文档介绍如何使用提供的测试脚本来验证 biz-napi 的功能。

## 🚀 快速开始

### 1. 构建项目
```bash
npm run build
```

### 2. 运行基础测试
```bash
npm run test:manual
```

### 3. 运行高级测试
```bash
npm run test:advanced
```

## 📋 测试脚本说明

### test/test-manual.js - 基础测试脚本
最简单的测试脚本，适合快速验证功能是否正常。

**特性:**
- 显示所有类型的输入事件
- 自动限制鼠标移动事件频率（避免刷屏）
- 实时显示事件计数
- 友好的中文界面

**使用方法:**
```bash
npm run test:manual
# 或
node test/test-manual.js
```

### test/test-advanced.js - 高级测试脚本
提供更多配置选项和统计功能的测试脚本。

**特性:**
- 事件过滤
- 统计信息显示
- JSON 输出格式
- 详细的事件分析

**使用方法:**
```bash
npm run test:advanced

# 只显示按键事件
npm run test:advanced -- --filter=KeyPress

# 不显示鼠标移动事件，显示统计
npm run test:advanced -- --no-mouse-move --stats

# 输出 JSON 格式（可保存到文件）
npm run test:advanced -- --json > events.json
```

**命令行选项:**
- `--filter=type`: 只显示特定类型的事件
  - 可选值: `KeyPress`, `KeyRelease`, `ButtonPress`, `ButtonRelease`, `MouseMove`, `Wheel`
- `--no-mouse-move`: 不显示鼠标移动事件
- `--stats`: 每5秒显示一次统计信息
- `--json`: 以 JSON 格式输出事件
- `--help`: 显示帮助信息

## 🐛 故障排除

### 常见问题

1. **权限问题 (macOS/Linux)**
   ```
   Error: Access denied
   ```
   **解决方案:** 在 macOS 上，需要在"系统偏好设置 > 安全性与隐私 > 辅助功能"中授权终端或 Node.js 访问权限。

2. **构建失败**
   ```
   Error: Cannot find module './dist/index.js'
   ```
   **解决方案:** 确保先运行 `npm run build` 构建项目。

3. **事件未触发**
   - 检查是否有其他应用程序拦截了输入事件
   - 确认权限设置正确
   - 尝试重启测试脚本

### 调试技巧

1. **使用 JSON 输出模式进行调试**
   ```bash
   npm run test:advanced -- --json > debug.json
   ```

2. **只监听特定事件类型**
   ```bash
   npm run test:advanced -- --filter=KeyPress
   ```

3. **查看详细统计信息**
   ```bash
   npm run test:advanced -- --stats --no-mouse-move
   ```

## 📊 性能测试

### 事件频率测试
1. 快速按键测试 - 验证高频按键事件处理
2. 鼠标移动测试 - 验证鼠标移动事件的频率限制
3. 长时间运行测试 - 验证内存泄漏和稳定性

### 建议的测试时间
- 基础功能测试: 2-5 分钟
- 性能测试: 10-30 分钟
- 稳定性测试: 1+ 小时

## 💡 最佳实践

1. **测试前准备**
   - 关闭不必要的应用程序
   - 确保有足够的终端窗口空间查看输出
   - 准备测试用例清单

2. **测试过程中**
   - 有序地进行各种输入操作
   - 注意观察事件的时间戳和计数
   - 记录任何异常行为

3. **测试后**
   - 检查是否所有预期事件都被捕获
   - 验证事件数据的准确性
   - 清理测试生成的文件

## 🔗 相关文件

- `test/test-manual.js` - 基础测试脚本
- `test/test-advanced.js` - 高级测试脚本  
- `__test__/monitor.test.ts` - 单元测试
- `lib/monitor.ts` - TypeScript 类型定义
