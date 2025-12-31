# Feature Specification: Electron 桌面版与 SEO 抓取器

**Feature Branch**: `001-electron-desktop`  
**Created**: 2025-12-29  
**Status**: Draft  
**Input**: User description: "使用electorn 重构 为桌面 软件 ，目标系统 win64 风格主题保持不变 去掉系统自带的顶部操作区，改为自行实现 然后实现 html 抓取模块， 这个工具模块是为了请求指定url， 抓取html 分析seo，各方面展示情况，抓到什么文本， canonical， sitemap什么的都要展示出来 要支持切换语言"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 自定义窗口的 Win64 桌面应用 (Priority: P1)

作为桌面用户，我能在 Win64 Electron 应用中看到与现有主题一致的界面，并使用自定义窗口栏完成最小化/关闭等操作。

**Why this priority**: 桌面化与自定义窗口是交付模式的基础，不满足即无法发布。

**Independent Test**: 安装并启动 win64 构建，确认自定义顶部栏存在且可完成最小化/关闭，主题颜色与 Web 版一致。

**Acceptance Scenarios**:

1. **Given** 应用启动，**When** 我点击自定义窗口栏的最小化，**Then** 窗口被最小化且主题样式保持一致。
2. **Given** 应用启动，**When** 我点击自定义窗口栏的关闭，**Then** 应用正常退出，无系统默认标题栏闪现。

---

### User Story 2 - URL 抓取与 SEO 展示 (Priority: P1)

作为使用者，我输入任意 URL，即可抓取页面 HTML，并看到 SEO 信号（标题、meta、canonical、sitemap 链接、H1-H6、主要文本、HTTP 状态等）。

**Why this priority**: SEO 抓取和展示是工具的核心价值。

**Independent Test**: 输入可访问的 URL，抓取成功时展示原始 HTML、解析出的 SEO 字段；错误时给出可读错误并保留输入。

**Acceptance Scenarios**:

1. **Given** 我输入有效 URL，**When** 点击抓取，**Then** 显示 HTTP 状态、原始 HTML、标题、描述、canonical、H1-H6、文本摘要，以及发现的 sitemap/robots 线索。
2. **Given** 我输入无效或无法访问的 URL，**When** 点击抓取，**Then** 提示错误并保持输入，不崩溃。

---

### User Story 3 - 语言切换 (Priority: P2)

作为多语言用户，我可以在应用内切换语言（至少中英文），界面和 SEO 字段标签即时切换，主题保持一致。

**Why this priority**: 宪章要求所有可见文本支持语言切换，保障可用性。

**Independent Test**: 在运行中的应用切换语言，所有 UI 文本和 SEO 字段标签即时切换，无需重启。

**Acceptance Scenarios**:

1. **Given** 应用运行，**When** 我切换到 English，**Then** 所有菜单/字段标签显示英文且布局未破坏。
2. **Given** 应用运行，**When** 我切回 简体中文，**Then** 文本恢复中文且主题保持一致。

---

### Edge Cases

- 输入 URL 无效或无协议时的提示与校验。
- 网络不可用、DNS 失败、超时、非 2xx/3xx 状态码的反馈。
- HTML 体积过大时的截断或性能保护策略。
- 目标站点使用重定向或 HTTPS 证书异常。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 提供 Win64 Electron 桌面构建，支持开发与打包。
- **FR-002**: 自定义窗口栏替代系统标题栏，支持最小化、最大化/还原、关闭。
- **FR-003**: 继承现有主题样式，移植到桌面窗口与新模块。
- **FR-004**: 提供 URL 输入并通过 Node 侧请求抓取 HTML，处理重定向与超时。
- **FR-005**: 展示 HTTP 状态码、原始 HTML 与解析后的 SEO 字段（title、meta description、meta keywords、robots、canonical）。
- **FR-006**: 展示 H1-H6 层级与主要可见文本摘要；支持查看发现的 sitemap/robots 线索。
- **FR-007**: 支持运行时语言切换（至少 zh-CN 与 en-US），所有可见文本均受控。
- **FR-008**: 错误与加载状态可视化，避免 UI 卡死，输入内容在错误时保留。
- **FR-009**: 持久化语言偏好（本地存储于用户侧，启动时应用）。
- **FR-010**: 本迭代不提供抓取结果导出功能，仅支持界面展示与复制。

### Key Entities *(include if feature involves data)*

- **FetchRequest**: 包含 URL、请求时间、超时设置、语言。
- **FetchResult**: 包含状态码、耗时、原始 HTML、SEO 信号、文本摘要、错误信息。
- **WindowChromeState**: 记录窗口大小/最大化状态及主题。
- **I18nLocale**: 标识当前语言、可用语言列表、翻译资源。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Win64 构建可启动，窗口自定义栏可正常最小化/关闭且主题一致。
- **SC-002**: 输入有效 URL 后 3 秒内返回并展示 SEO 结果（在正常网络条件下）。
- **SC-003**: SEO 结果至少包含 title、meta description、canonical、H1-H6、文本摘要、发现的 sitemap/robots 线索。
- **SC-004**: 语言切换后，界面文本与字段标签 100% 按选定语言显示，无需重启。
