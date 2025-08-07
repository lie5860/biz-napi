# CI/CD 工作流文档

本项目使用 GitHub Actions 实现完整的 CI/CD 流程，支持自动化测试、构建和发布。

## 🔄 工作流概览

### 1. CI 工作流 (`ci.yml`)
**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 创建针对 `main` 或 `develop` 的 Pull Request
- 手动触发

**功能：**
- 代码质量检查（TypeScript、Rust 格式化和 linting）
- 跨平台构建测试
- 多 Node.js 版本兼容性测试

### 2. 发布工作流 (`release.yml`)
**触发条件：**
- `package.json` 中版本号发生变化（推送到 `main` 分支）
- 手动触发（支持指定版本号和 dry-run 模式）

**功能：**
- 版本变动检测
- 完整测试套件验证（覆盖率 >90%）
- 多平台构建
- 自动发布到 NPM
- 创建 GitHub Release

### 3. 测试工作流 (`test.yml`)
**触发条件：**
- 测试相关文件变更
- Pull Request 创建/更新
- 手动触发（支持测试过滤和覆盖率阈值设置）

**功能：**
- 多环境测试（Ubuntu、Windows、macOS）
- 多 Node.js 版本测试（16、18、20）
- TypeScript 类型检查
- 性能基准测试
- 安全漏洞扫描

### 4. Dependabot 自动合并 (`dependabot-auto-merge.yml`)
**功能：**
- 自动合并小版本和补丁版本依赖更新
- 主版本更新需要手动审查
- 等待 CI 检查通过后自动合并

## 🚀 使用指南

### 自动发布流程

1. **版本号更新触发：**
   ```bash
   # 更新版本号（会自动触发发布）
   npm version patch  # 或 minor/major
   git push origin main
   ```

2. **手动触发发布：**
   - 前往 GitHub Actions 页面
   - 选择 "Release" 工作流
   - 点击 "Run workflow"
   - 可选择指定版本号或启用 dry-run 模式

### 测试验证

发布前会自动执行以下验证：
- ✅ 所有单元测试通过
- ✅ 代码覆盖率 ≥ 90%
- ✅ TypeScript 类型检查通过
- ✅ Rust 代码格式化和 linting 通过
- ✅ 多平台构建成功
- ✅ 性能基准测试通过
- ✅ 安全漏洞扫描通过

### 手动测试选项

```bash
# 运行特定测试
npm test -- --testNamePattern="sum function"

# 运行覆盖率测试
npm run test:coverage

# 监听模式
npm run test:watch
```

## 📊 质量保证

### 测试覆盖率要求
- **语句覆盖率：** 100%
- **分支覆盖率：** 100%
- **函数覆盖率：** 100%
- **行覆盖率：** 100%

### 支持的平台
- **macOS：** x64, ARM64
- **Windows：** x64, x86
- **Linux：** x64

### Node.js 版本支持
- Node.js 16.x, 18.x, 20.x
- 主要测试环境：Node.js 18.x

## 🔧 环境变量和密钥

### 必需的 GitHub Secrets：
- `NPM_TOKEN`: NPM 发布令牌
- `CODECOV_TOKEN`: Codecov 上传令牌（可选）

### 环境变量：
- `DEBUG=napi:*`: 启用 NAPI 调试输出
- `MACOSX_DEPLOYMENT_TARGET=10.13`: macOS 最低支持版本

## 📋 发布检查清单

发布前，系统会自动验证：

- [ ] 版本号已更新
- [ ] 所有测试通过
- [ ] 代码覆盖率达标
- [ ] 构建在所有支持平台成功
- [ ] 没有高危安全漏洞
- [ ] 性能基准测试通过
- [ ] TypeScript 类型定义正确

## 🚨 故障排查

### 常见问题：

1. **测试失败：**
   ```bash
   npm test  # 本地运行测试
   npm run test:coverage  # 检查覆盖率
   ```

2. **构建失败：**
   ```bash
   npm run build  # 本地构建测试
   cargo check  # Rust 代码检查
   ```

3. **类型错误：**
   ```bash
   npx tsc --noEmit  # TypeScript 类型检查
   ```

4. **格式化问题：**
   ```bash
   cargo fmt  # Rust 代码格式化
   npx prettier --write .  # JavaScript/TypeScript 格式化
   ```

### 手动干预场景：

- 主版本依赖更新需要手动审查
- 安全漏洞需要手动修复
- 性能回归需要手动优化
- 构建失败需要手动调试

## 📈 监控和通知

- **构建状态：** GitHub Actions 状态徽章
- **测试覆盖率：** Codecov 报告
- **依赖安全：** Dependabot 安全警报
- **性能监控：** 基准测试结果

## 🔄 持续改进

定期检查和更新：
- 依赖版本更新（Dependabot 自动化）
- CI/CD 工作流优化
- 测试用例完善
- 性能基准调整
- 安全配置更新
