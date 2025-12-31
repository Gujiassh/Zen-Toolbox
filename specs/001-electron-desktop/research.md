# Research - Electron 桌面版与 SEO 抓取器

## Decisions & Rationale

### Electron 版本与打包
- **Decision**: 使用 Electron 33.x（当前稳定主线）+ `electron-builder`（NSIS 目标 Win64），Vite 作为渲染构建。
- **Rationale**: 33.x 提供最新安全修复与 Node 20+ 支持；`electron-builder` 在 Win64 打包、代码签名与自定义图标/installer 支持成熟，并与 Vite 配置简洁。
- **Alternatives considered**: `electron-forge`（脚手架友好但打包配置分散）；`electron-vite`（集成度高，但已有 Vite 配置，迁移成本高）。

### 抓取与解析策略
- **Decision**: 在主进程使用 Node `fetch`（跟随重定向，超时 10s，最大正文 3MB）抓取 HTML；使用 `cheerio` 解析，提取 HTTP 状态、标题、meta（description/keywords/robots）、canonical、H1-H6、文本摘要（前 3-5 段可见文本）、以及 `<link rel="sitemap">`、`<meta name="sitemap">` 等线索；若同源 robots.txt 可在 3s 内获取，则解析其中的 `Sitemap:` 行。
- **Rationale**: 主进程抓取规避 CORS，`cheerio` 轻量且解析 SEO 标签可靠；受控超时与大小上限避免界面卡顿；robots 检查提升 sitemap 呈现成功率。
- **Alternatives considered**: `axios`（功能相近但无必要）；`jsdom`（更重，渲染成本高）；不查 robots（miss sitemap 线索）。

### 国际化方案
- **Decision**: 采用 `i18next` + `react-i18next`，提供 zh-CN / en-US 资源文件，默认 zh-CN；语言偏好存储于 renderer 侧 localStorage（或用户数据目录 JSON）并在启动时加载。
- **Rationale**: `react-i18next` 对 React 19 兼容，支持运行时切换与命名空间管理；本地存储实现最小化且离线安全。
- **Alternatives considered**: `@lingui/react`（编译型，集成成本更高）；自研上下文（缺少成熟的 ICU 处理与插值）。

### 测试与验证
- **Decision**: 使用 Vitest 覆盖解析函数与组件交互（jsdom 环境）；使用 Playwright 的 Electron runner 进行冒烟测试（窗口创建、自定义窗口按钮可用、i18n 切换、抓取假服务器 URL）。
- **Rationale**: Vitest 与 Vite 配合无缝，Playwright 提供稳定的 Electron 控制与截图能力；Spectron 已弃用。
- **Alternatives considered**: Jest（额外配置成本）；Spectron（维护停止）；手工验证（不满足可重复性）。

### 性能与体验基线
- **Decision**: 目标在正常网络下，抓取+解析常规页面（<=1MB HTML）在 3s 内完成；超时 10s；解析阶段限制输出长度（原始 HTML 可折叠显示）；启动窗口 <2s。
- **Rationale**: 与 SEO 诊断场景的及时性匹配；设置上限防止大页面拖垮 UI。
- **Alternatives considered**: 无超时/无限大小（风险大）；更严苛限制（可能截断关键信息）。

### 数据持久化与导出
- **Decision**: 持久化语言偏好（localStorage/用户数据目录）；本迭代不提供抓取结果导出，仅提供界面展示与复制原始/解析文本。
- **Rationale**: 偏好持久化提升体验；导出非核心诉求且增加范围，可留待后续。
- **Alternatives considered**: 立即实现 JSON/Markdown 导出（加大范围与测试面）；不持久化语言（违背体验要求）。

### 安全与 IPC
- **Decision**: 启用 contextIsolation 与 sandbox=false（主进程）、通过 preload 的 contextBridge 暴露有限 API：`seoFetch(url)`、`windowControls`；拒绝任意执行与文件写入。
- **Rationale**: 满足最小暴露原则，降低渲染进程风险；与 Electron 最佳实践一致。
- **Alternatives considered**: 直接在渲染层用 fetch（受 CORS 限制）；在 preload 打开 nodeIntegration（安全性差）。
