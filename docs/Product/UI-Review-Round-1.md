# AS VISA UI Review Round 1

## Source

Screenshots were captured from the latest pushed code on `main`.

- Commit: `fbe3a23 Implement official Mission page UI`
- Build mode: production build with `next build` and `next start`
- Viewport: 390px by 844px mobile viewport
- Capture mode: visible viewport screenshot
- Screenshot folder: `docs/Design/screenshots/ui-review-round-1/`

## Screenshot Files

| Page | Route | File |
| --- | --- | --- |
| Login | `/login` | `docs/Design/screenshots/ui-review-round-1/01-login.png` |
| Mission | `/mission` | `docs/Design/screenshots/ui-review-round-1/02-mission.png` |
| Upload | `/upload` | `docs/Design/screenshots/ui-review-round-1/03-upload.png` |
| AI Review | `/ai-review` | `docs/Design/screenshots/ui-review-round-1/04-ai-review.png` |
| Completion | `/completion` | `docs/Design/screenshots/ui-review-round-1/05-completion.png` |
| Progress | `/progress` | `docs/Design/screenshots/ui-review-round-1/06-progress.png` |

## Capture Notes

- Login was captured in its empty initial state.
- Mission, Upload, and AI Review were captured after completing the mock login flow, which resets the current mission to the first document mission.
- AI Review was captured at the beginning of the review animation.
- All screenshots were captured with no horizontal scrolling.
- Visible viewport screenshots were used so the saved files match the requested mobile review frame.

## Known Visual Issues

- Login full-page height is 845px in a 390px by 844px viewport, which creates a 1px vertical overflow. This is visually minor and does not create horizontal scrolling.
- AI Review is animated, so the captured screenshot represents the initial review state rather than every intermediate state.
- Mission uses a CSS-drawn passport illustration; this should be replaced with a final brand-approved asset if one is provided later.

## Verification

The screenshot capture used the current production build:

```bash
npm install
npm --workspace apps/customer run build
npm exec next start -- -p 3000
```
