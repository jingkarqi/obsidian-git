# Repository Guidelines

## Project Structure & Module Organization
Core plugin code lives in `src/`: `main.ts` bootstraps the Obsidian plugin, `gitManager/` handles Git transports, and `lineAuthor/` hosts diff/author panes. Shared helpers (`constants.ts`, `promiseQueue.ts`, `types.ts`) sit alongside. Reference docs reside in `docs/`, screenshots in `images/`, while build metadata (`manifest.json`, `styles.css`, `esbuild.config.mjs`, `.github/`) stays at the root.

## Build, Test, and Development Commands
- `pnpm install` - install dependencies (Node >=18, pnpm >=9).
- `pnpm run dev` - esbuild watch; copies bundles next to `manifest.json` for dev vaults.
- `pnpm run build` - production build with minified JS/CSS.
- `pnpm run lint` / `pnpm run format` - ESLint + Prettier over `src/`.
- `pnpm run tsc` / `pnpm run svelte` - strict TS and Svelte diagnostics.
- `pnpm run all` - gate that runs type, Svelte, format, and lint steps sequentially.

## Coding Style & Naming Conventions
The repo enforces LF endings, UTF-8, and 4-space indentation via `.editorconfig`. Prefer descriptive TypeScript modules with one public entry per file (`statusBar.ts`, `gitManager.ts`). Use camelCase for variables/functions, PascalCase for classes and Svelte components, and kebab-case for CSS selectors. Run Prettier (configured in `.prettierrc.json`) and fix ESLint issues before committing; avoid mixing optional chaining and null checks inconsistently.

## Testing Guidelines
There is no Jest/Vitest layer yet, so lean on static checks plus manual smoke tests inside an Obsidian dev vault that points at your build output. Run `pnpm run tsc`, `pnpm run svelte`, and `pnpm run all` before verifying automation flows (scheduled commit, diff panes, offline sync). Document manual scenarios in PRs, and name any future specs `src/__tests__/<feature>.spec.ts` for discoverability.

## Commit & Pull Request Guidelines
Commits follow the conventional style already in history (`fix: detect offline error`, `chore(release): 2.35.2`). Keep subject lines <=72 chars, reference issues with `fixes #123`, and explain user-facing impact plus testing notes in the body. PRs should include a concise summary, reproduction/validation steps, screenshots for UI changes, and call out any migration or settings defaults touched. Keep branches rebased and ensure `pnpm run all` succeeds before requesting review.

## Security & Configuration Tips
Never commit vault data, tokens, or SSH keys; rely on local `.gitconfig` and Obsidian's credential helpers. Desktop builds prefer system Git fallback while mobile uses isomorphic-git, so guard new features behind capability flags and sanitize debug logs inside `debug` namespaces. Update docs when adding settings that affect automation cadence or destructive Git commands.

---

# Obsidian Git 插件项目

## 项目概述

这是一个为 Obsidian.md 开发的 Git 集成插件，提供强大的版本控制功能。该插件允许用户在 Obsidian 中直接进行 Git 操作，包括自动提交、拉取、推送和查看更改。

**主要技术栈：**
- TypeScript
- Svelte (用于UI组件)
- isomorphic-git (移动端Git实现)
- simple-git (桌面端Git实现)
- esbuild (构建工具)
- Obsidian API

**项目架构：**
- `src/main.ts` - 插件主入口点
- `src/gitManager/` - Git操作管理器(桌面端和移动端不同实现)
- `src/ui/` - 用户界面组件(源代码控制、历史记录、差异视图等)
- `src/lineAuthor/` - 行作者功能实现
- `src/setting/` - 设置管理
- `src/automaticsManager.ts` - 自动操作管理器

## 构建和运行

### 开发环境设置
```bash
# 安装依赖
pnpm install

# 开发模式构建(带热重载)
pnpm run dev

# 生产模式构建
pnpm run build
```

### 可用脚本
- `pnpm run dev` - 开发模式构建和监听文件变化
- `pnpm run build` - 生产模式构建
- `pnpm run lint` - 代码检查
- `pnpm run format` - 代码格式化
- `pnpm run tsc` - TypeScript类型检查(不生成文件)
- `pnpm run svelte` - Svelte组件检查
- `pnpm run all` - 运行所有检查(tsc, svelte, format, lint)
- `pnpm run release` - 使用standard-version创建新版本

### 构建配置
- 使用 `esbuild` 作为构建工具，配置在 `esbuild.config.mjs` 中
- 支持 TypeScript 和 Svelte 文件
- 开发模式生成内联源映射，生产模式启用压缩
- 输出文件为 `main.js`

## 开发约定

### 代码风格
- 使用 ESLint 进行代码检查，配置在 `eslint.config.mjs`
- 使用 Prettier 进行代码格式化，配置在 `.prettierrc.json`
- TypeScript 配置在 `tsconfig.json`，启用严格模式

### 目录结构约定
- `src/` - 所有源代码
- `src/ui/` - UI组件，按功能分目录(diff, history, modals等)
- `src/gitManager/` - Git管理器实现
- `docs/` - 项目文档
- `images/` - 项目图片资源

### 插件开发约定
- 使用 Obsidian 插件 API
- 主类继承自 `Plugin` 类
- 使用 `registerView` 注册自定义视图
- 使用 `addCommand` 注册命令
- 使用 `addSettingTab` 添加设置选项卡

### Git 操作约定
- 桌面端使用 `simple-git` 库
- 移动端使用 `isomorphic-git` 库
- 通过 `GitManager` 接口抽象不同实现
- 使用 `PromiseQueue` 管理异步操作队列

### UI 组件约定
- 使用 Svelte 构建用户界面
- 视图组件注册在 `main.ts` 中
- 模态框组件放在 `src/ui/modals/` 目录
- 使用 Obsidian 的原生 UI 组件和样式

### 测试和验证
- 运行 `pnpm run all` 确保代码质量
- 在 Obsidian 中测试插件功能
- 检查桌面端和移动端的兼容性

### 版本管理
- 使用 `standard-version` 进行版本管理
- 版本号在 `package.json` 和 `manifest.json` 中同步
- 遵循语义化版本控制

## 特殊注意事项

### 移动端限制
- 移动端使用 JavaScript 实现 Git，功能有限
- 不支持 SSH 认证
- 仓库大小受内存限制
- 不支持 rebase 合并策略
- 不支持子模块

### 文件监听
- 使用 Obsidian 的文件系统事件监听文件变化
- 实现防抖机制避免频繁操作
- 支持自动提交功能

### 状态管理
- 使用插件状态跟踪当前 Git 操作
- 实现缓存机制提高性能
- 支持离线模式检测

## 贡献指南

1. 确保代码符合项目的 ESLint 和 Prettier 配置
2. 运行 `pnpm run all` 确保所有检查通过
3. 测试桌面端和移动端兼容性
4. 更新相关文档
5. 使用清晰的提交信息
---
## 交流指导
全程使用中文和用户对话,但是可以用英文思考和注释