# Data Model - Electron 桌面版与 SEO 抓取器

## FetchRequest
- **Fields**:
  - `url` (string, required): 绝对 URL（含协议），需通过 URL 校验。
  - `language` (enum: `zh-CN` | `en-US`, default `zh-CN`): 界面与结果标签语言。
  - `timeoutMs` (number, default 10000): 抓取超时，限制 3000-15000。
  - `maxBytes` (number, default 3_000_000): 响应正文最大读取字节。
  - `requestedAt` (ISO datetime): 触发时间。
  - `userAgent` (string, optional): 自定义 UA；未填使用应用默认。
- **Validation**: URL 必须包含协议；超时与 maxBytes 在安全范围内；language 必须为受支持枚举。

## FetchResult
- **Fields**:
  - `statusCode` (number, optional): HTTP 状态码。
  - `redirectedTo` (string, optional): 最终 URL（若有重定向）。
  - `durationMs` (number): 抓取 + 解析耗时。
  - `html` (string, optional): 原始 HTML（可能截断/折叠）。
  - `seo` (object):
    - `title` (string, optional)
    - `metaDescription` (string, optional)
    - `metaKeywords` (string, optional)
    - `metaRobots` (string, optional)
    - `canonical` (string, optional)
    - `headings` (array of { `tag`: `h1`-`h6`, `text`: string })
    - `textPreview` (array of string): 前几段可见文本摘要。
    - `sitemapLinks` (array of string): 从 HTML/robots 提取的 sitemap 线索。
    - `robotsTxt` (string, optional): 读取的 robots.txt 片段（若获取）。
  - `error` (object, optional): `message`, `type` (`network`|`timeout`|`parse`|`invalid_input`).
  - `success` (boolean): 是否成功解析。
- **Validation**: `success` 与 `error` 互斥；`html` 可被长度限制；`statusCode` 在 100-599。

## WindowChromeState
- **Fields**:
  - `isMaximized` (boolean)
  - `bounds` (object): `width`, `height`, `x`, `y`（可选，用于还原）。
  - `theme` (string): 当前主题标识（维持现有风格）。
- **Validation**: bounds 需为正整数；theme 必须是支持的主题。

## I18nLocale
- **Fields**:
  - `current` (enum: `zh-CN` | `en-US`)
  - `available` (array of enum): 支持列表。
  - `resourcesVersion` (string): 资源版本，用于缓存/刷新。
- **Validation**: `current` 必须包含在 `available` 中。

## Relationships
- `FetchResult` 与 `FetchRequest` 通过请求/响应耦合：日志或 UI 可显示 `requestedAt`、`url` 与结果。
- `I18nLocale.current` 影响 UI 文本呈现与抓取时的 `Accept-Language` 头（可选）。
- `WindowChromeState.theme` 应与渲染层主题同步，避免状态漂移。
