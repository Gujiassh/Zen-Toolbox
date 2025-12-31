<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles:
- Initialized → Documentation Cascade Is Mandatory
- Initialized → File Headers Declare I/O and Position
- Initialized → Desktop App via Electron with Custom Chrome
- Initialized → SEO HTML Capture and Reporting Is Core
- Initialized → Consistent Theme with Language Switching
Added sections:
- Core Principles
- Additional Constraints & Architecture Notes
- Development Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (reviewed, aligns; no changes needed)
- ✅ .specify/templates/spec-template.md (reviewed, aligns; no changes needed)
- ✅ .specify/templates/tasks-template.md (reviewed, aligns; no changes needed)
Follow-up TODOs:
- None
-->

# Zen Toolbox Constitution

## Core Principles

### Documentation Cascade Is Mandatory
- Every functionality, architecture, or writing change MUST immediately update the root README and affected subfolder docs; merges are blocked if documentation lags.
- Each folder MUST keep a <=3-line architecture note listing contained files, their role, and hierarchy placement.
- Rationale: Keeps the tool self-explanatory and prevents stale guidance across nested docs.

### File Headers Declare I/O and Position
- Every file starts with three comment lines: `Input: <external deps>`, `Output: <exposed behaviors/data>`, `Pos: <role within module/system>`, followed by “update me when folder changes”.
- When a file changes, its header and parent folder note MUST be updated in the same change set.
- Rationale: Maintains traceability of contracts and structure.

### Desktop App via Electron with Custom Chrome
- Delivery target is a Windows 64-bit Electron desktop build; browser-only delivery is non-compliant.
- System chrome MUST be replaced with custom window controls while preserving the existing theme and styling.
- Rationale: Ensures platform parity and a consistent UX across packaged builds.

### SEO HTML Capture and Reporting Is Core
- The HTML fetcher MUST request a specified URL, capture raw HTML, and surface SEO signals (title/meta, canonical, sitemap links, headings, extracted text, status).
- Output MUST expose both raw content and parsed analysis for visibility and troubleshooting.
- Rationale: Primary tool value is transparent SEO inspection; regressions block releases.

### Consistent Theme with Language Switching
- UI theme and colors stay consistent with the current design across all screens and new features.
- All user-visible text MUST support runtime language switching; new strings are not acceptable without i18n coverage.
- Rationale: Preserves brand cohesion and accessibility for multilingual users.

## Additional Constraints & Architecture Notes

- Root README must emphasize that any functional, architectural, or writing change requires updating relevant subdocs; it serves as a tool overview, not marketing.
- Every directory maintains a minimal (<=3-line) architecture note listing contained files, purpose, and status; include “update me if this folder changes”.
- File headers follow the Input/Output/Pos plus update-warning convention before any code or imports.
- Default build stack is Electron + React/Vite targeting Windows 64-bit; removing desktop packaging or custom chrome is prohibited.
- SEO fetch capability must report canonical targets, discovered sitemap references, extracted text, and other SEO markers in a readable view.

## Development Workflow & Quality Gates

- Before merge, confirm README and touched directory notes are updated to reflect scope, architecture, and writing changes.
- Reject changes that modify a file without updating its Input/Output/Pos header and the parent folder note.
- Plans, specs, and tasks must include acceptance for Electron packaging (win64), custom window chrome, SEO analysis output, and language toggle coverage when relevant.
- Feature validation includes verifying SEO fetch output shows raw HTML plus parsed SEO data, and that UI theme plus language switching remain consistent.

## Governance

- This constitution supersedes other practice docs; deviations require an approved amendment recorded with version and date.
- Amendments require updating this file, listing impacts in the Sync Impact Report, and notifying maintainers via the next change set.
- Versioning follows SEMVER: MAJOR for governance or principle redefinitions/removals; MINOR for new principles or sections; PATCH for clarifications.
- Compliance is reviewed on every PR/merge: documentation cascade, file headers, platform constraints, SEO/i18n gates, and theme checks are blocking criteria.
- Archive prior versions in VCS history; ratification date remains the original adoption date, last amended reflects the latest change.

**Version**: 1.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29
