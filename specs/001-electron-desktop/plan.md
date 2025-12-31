# Implementation Plan: Electron 桌面版与 SEO 抓取器

**Branch**: `001-electron-desktop` | **Date**: 2025-12-29 | **Spec**: /specs/001-electron-desktop/spec.md
**Input**: Feature specification from `/specs/001-electron-desktop/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

重构为 Win64 Electron 桌面应用，移除系统标题栏并保留现有主题；实现 HTML 抓取与 SEO 展示（原始 HTML + 解析信号）；支持中英文切换。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.8, React 19.2, Vite 6.2, Electron 33.x  
**Primary Dependencies**: React/ReactDOM, Vite, Electron 33.x, `electron-builder`（NSIS Win64），`cheerio`（SEO 解析），`i18next`/`react-i18next`（i18n）  
**Storage**: 语言偏好持久化（localStorage/用户数据目录）；其余数据内存态  
**Testing**: Vitest（解析/组件）+ Playwright Electron（窗口与抓取冒烟）  
**Target Platform**: Windows 64-bit Electron 桌面应用  
**Project Type**: 单一项目（Electron 主进程 + React/Vite 渲染进程）  
**Performance Goals**: 启动 <2s；常规页面（<=1MB）抓取+解析 <3s；超时 10s；最大正文 3MB  
**Constraints**: 自定义窗口 chrome、主题一致；contextIsolation + 受限 IPC；抓取跟随重定向、10s 超时、3MB 上限；不实现结果导出；无离线缓存需求  
**Scale/Scope**: 单用户桌面工具，有限并发

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- 文档级联：功能/架构/写法调整须更新根 README 与对应子目录说明。
- 文件头：所有文件需在开头写 Input/Output/Pos + “文件夹变更请更新我”，修改时同步更新。
- 平台：必须交付 Win64 Electron，自定义窗口控件替代系统标题栏。
- 功能：HTML 抓取需显示原始 HTML + SEO 信号（title/meta/canonical/sitemap/heading/文本）。
- 主题与语言：保持当前主题风格，所有文本可运行时切换语言。
- 合规：上述为阻断项，计划/实现/验收均需显式覆盖。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
electron/
├── main.ts                # 主进程入口，创建无系统标题栏窗口
├── preload.ts             # contextBridge 暴露安全 API（抓取、窗口控制）
└── window-controls.ts     # 自定义窗口按钮逻辑

renderer/
├── index.html
└── src/
    ├── index.tsx
    ├── App.tsx
    ├── components/
    ├── tools/HtmlFetcher.tsx
    ├── constants.tsx
    ├── types.ts
    ├── i18n/
    └── theme/

tests/
├── unit/                  # 解析与纯函数（Vitest）
├── integration/           # 组件交互（Vitest/jsdom）
└── smoke/                 # Electron 启动与窗口控制（Playwright/Electron）
```

**Structure Decision**: 单一 Electron 项目：electron/ 管主进程与窗口控制，renderer/ 由 Vite/React 渲染，tests/ 覆盖解析、组件与 Electron 冒烟。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
