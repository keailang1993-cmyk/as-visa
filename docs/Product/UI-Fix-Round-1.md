# AS VISA UI Fix Round 1

## Scope

This pass upgrades the existing Upload, AI Review, Progress, and Completion screens so they visually align with the approved Mission page direction.

No new routes, business logic, or features were added.

## Files Changed

- `apps/customer/app/upload/page.tsx`
- `apps/customer/app/upload/upload.module.css`
- `apps/customer/app/ai-review/page.tsx`
- `apps/customer/app/ai-review/ai-review.module.css`
- `apps/customer/app/progress/page.tsx`
- `apps/customer/app/progress/progress.module.css`
- `apps/customer/app/completion/page.tsx`
- `apps/customer/app/completion/completion.module.css`
- `docs/Design/screenshots/ui-fix-round-1/01-upload.png`
- `docs/Design/screenshots/ui-fix-round-1/02-ai-review.png`
- `docs/Design/screenshots/ui-fix-round-1/03-progress.png`
- `docs/Design/screenshots/ui-fix-round-1/04-completion.png`

## What Was Improved

- Upload now feels like a guided document submission screen instead of a generic file picker.
- AI Review now uses a calmer premium review state with progress, checklist, and estimated time.
- Progress now reads like mobile order tracking with a focused current status card.
- Completion now feels warmer and more reassuring, with one clear next action.
- All four pages now share the same AS VISA header rhythm, mobile shell, card radius, soft shadow, typography hierarchy, and NOIR visual language.

## Screenshot List

| Screen | Route | Screenshot |
| --- | --- | --- |
| Upload | `/upload` | `docs/Design/screenshots/ui-fix-round-1/01-upload.png` |
| AI Review | `/ai-review` | `docs/Design/screenshots/ui-fix-round-1/02-ai-review.png` |
| Progress | `/progress` | `docs/Design/screenshots/ui-fix-round-1/03-progress.png` |
| Completion | `/completion` | `docs/Design/screenshots/ui-fix-round-1/04-completion.png` |

## Verification

- TypeScript type checks passed.
- Production build passed.
- Screenshots were captured at `390px` mobile viewport from the latest local code.
- No horizontal scrolling was detected during screenshot capture.

## Remaining TODO

- Test the screens inside the real WeChat WebView on physical devices.
- Replace MVP mock document assets with final brand-approved imagery when available.
