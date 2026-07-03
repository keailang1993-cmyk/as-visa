# AS VISA Mission UI Review

## Scope

This review covers the Mission page UI upgrade based on the official AS VISA Mission visual specification.

No business logic, routes, or mission flow behavior were changed.

## Files Changed

- `apps/customer/app/mission/page.tsx`
- `apps/customer/app/mission/mission.module.css`
- `packages/ui/src/icons/index.ts`

## What Was Implemented

- Rebuilt the Mission page as a premium mobile-first screen.
- Added the official hierarchy:
  - system status bar
  - AS VISA header
  - notification icon
  - personalized greeting
  - current mission card
  - material explanation card
  - overall progress section
  - bottom navigation
- Matched the NOIR design language:
  - monochrome UI
  - generous whitespace
  - 16px radius cards
  - soft shadows
  - refined typography
  - subtle 180ms opacity/scale motion
- Preserved the existing mission flow by making the mission card the upload entry point.

## Business Logic

Existing behavior is preserved:

- Mission data still comes from `getCurrentMission()`.
- Clicking the current mission still routes to `/upload`.
- Completion state still follows the existing mission flow.
- No database, AI, or rule-engine behavior was changed.

## WeChat WebView Notes

- The layout is mobile-first and optimized around a 390px wide viewport.
- The page avoids horizontal scrolling.
- Bottom navigation remains fixed within the mobile application frame.

## Verification

Run:

```bash
npm install
npm run typecheck:ui
npm run typecheck:rule-engine
npm --workspace apps/customer run typecheck
npm --workspace apps/customer run build
```

## Remaining TODO

- Validate on an actual WeChat WebView device after deployment.
- Replace the CSS-drawn passport illustration with final brand-approved asset if provided.
