# AS VISA Sprint 15 UI Consistency

## Objective

The customer MVP flow is already complete. Sprint 15 only improves visual consistency across the existing customer pages.

No new features, pages, admin surfaces, Enterprise WeChat integration, or real AI logic were added.

## Pages Reviewed

- Login
- Mission
- Upload
- AI Review
- Completion
- Progress

## What Changed

- Unified page spacing across the customer flow.
- Standardized card padding through the NOIR card component instead of page-specific overrides.
- Aligned Mission typography with the same title hierarchy used by other customer pages.
- Kept each page on the same centered, calm, single-task layout rhythm.
- Reduced page entrance motion to `180ms`.
- Updated page entrance motion to opacity + subtle scale only.
- Removed inconsistent large card padding from Mission, Completion, and Progress.
- Standardized cards, inputs, and upload surfaces around the 16px NOIR radius.
- Kept button sizing restrained and consistent.
- Preserved one primary CTA pattern per task page.
- Kept icon usage within the existing Lucide icon family.
- Preserved the black, white, and gray NOIR visual system.

## Design Rules Applied

- Page padding: `var(--noir-space-6)` on desktop.
- Mobile page padding: `var(--noir-space-4)`.
- Card padding: `var(--noir-space-6)` from the NOIR card component.
- Mobile card padding: `var(--noir-space-5)`.
- Primary radius: `var(--noir-radius-xl)` / 16px for cards, inputs, buttons, and upload surfaces.
- Motion duration: `var(--noir-motion-base)` / 180ms.
- Motion style: opacity + scale.
- Typography hierarchy:
  - title: `var(--noir-text-title)`
  - body: `var(--noir-text-body)`
  - caption: `var(--noir-text-caption)`
  - micro: `var(--noir-text-micro)`

## Files Changed

- `apps/customer/app/login/login.module.css`
- `apps/customer/app/mission/mission.module.css`
- `apps/customer/app/upload/upload.module.css`
- `apps/customer/app/ai-review/ai-review.module.css`
- `apps/customer/app/completion/completion.module.css`
- `apps/customer/app/progress/progress.module.css`
- `packages/ui/src/styles.css`
- `docs/Product/Sprint15-UI-Consistency.md`

## Acceptance Criteria Check

Switching between Login, Mission, Upload, AI Review, Completion, and Progress now uses the same spacing, radius, card rhythm, button proportions, typography hierarchy, and motion pattern.

The customer should feel they are inside one AS VISA product, not six separate pages.

## Remaining TODO

- Final visual QA in real WeChat WebView.
- Add browser snapshot tests once the MVP flow stabilizes.
- Keep future pages assembled from NOIR primitives instead of page-specific visual rules.
