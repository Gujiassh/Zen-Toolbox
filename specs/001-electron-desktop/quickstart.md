# Quickstart - Electron 桌面版与 SEO 抓取器

## 前置要求
- Node.js ≥ 20，npm 或 pnpm。
- Windows 64 位环境（开发在 macOS/Linux 也可，但打包目标为 Win64）。

## 安装依赖
```bash
# 安装现有依赖
npm install

# 新增 Electron 与打包
npm install --save-dev electron@33 electron-builder

# SEO 解析与国际化
npm install cheerio i18next react-i18next

# 测试（计划）
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @playwright/test
```

## 开发模式
1. 启动渲染进程（Vite）：
   ```bash
   npm run dev
   ```
2. 启动 Electron 主进程（实施后添加脚本，例如）：
   ```bash
   npm run dev:electron   # 启动 main/preload + 连接 Vite
   ```
3. 验证自定义窗口栏：窗口无系统标题栏，最小化/关闭按钮可用，主题一致。

## 构建与分发（Win64）
```bash
npm run build            # 构建渲染进程
npm run build:electron   # （实施后添加）使用 electron-builder 生成 NSIS 安装包
```
- 构建产物：`dist/`（渲染）与 `dist_electron/`（安装包）。

## 测试
- 单元/组件（实施后添加）：`npm run test:unit`（Vitest）。
- Electron 冒烟：`npm run test:smoke`（Playwright Electron，启动窗口+按钮+i18n+抓取假 URL）。

## 功能验证清单
- 输入 URL，点击抓取：应显示 HTTP 状态、原始 HTML、标题/meta/canonical/robots、H1-H6、文本摘要、sitemap/robots 线索。
- 错误情形：无效 URL/超时/4xx/5xx 时给出可读提示，输入保持。
- 语言切换：在界面中切换 zh-CN/en-US，所有可见文本即时切换，布局未破坏。
- 主题：桌面端与现有主题一致，包含自定义窗口栏。
