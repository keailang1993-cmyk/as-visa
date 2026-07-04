# Figma V3 Implementation Plan

## Pages To Implement From Figma

1. Login V3
2. Mission V3
3. Upload V3
4. AI Review V3
5. Progress V3
6. Completion V3

## Current Files Mapping

- Login V3 -> `apps/customer/app/login/LoginExperience.tsx`
- Mission V3 -> `apps/customer/app/mission/page.tsx`
- Upload V3 -> `apps/customer/app/upload/page.tsx`
- AI Review V3 -> `apps/customer/app/ai-review/page.tsx`
- Progress V3 -> `apps/customer/app/progress/page.tsx`
- Completion V3 -> `apps/customer/app/completion/page.tsx`

Supporting route files:

- Login route wrapper -> `apps/customer/app/login/page.tsx`
- Legacy upload redirect -> `apps/customer/app/upload-passport/page.tsx`
- Mission flow state -> `apps/customer/app/lib/missionFlow.ts`

## Current Customer App Pages Reviewed

- Login
- Mission
- Upload
- AI Review
- Progress
- Completion

## Reusable Components To Extract

These components should become reusable after Figma V3 implementation:

- AppShell
- StatusBar
- AppHeader
- BottomNav
- PrimaryButton
- SecondaryButton
- MissionCard
- UploadCard
- ChecklistItem
- AIReviewCard
- ProgressTimeline
- CompletionState
- TrustNote

## Implementation Rules

- Follow Figma exactly
- Do not redesign
- Keep existing logic
- Keep existing routes
- Keep mobile-first layout
- Target viewport: `390px`
- Optimize for WeChat WebView
- Keep NOIR Design System

## Risks

- Bottom navigation consistency: current pages include bottom navigation in different contexts, so Figma V3 should define exactly which pages need it.
- Shared app shell structure: several pages repeat phone shell, status bar, header, and bottom navigation patterns in page-level CSS.
- Page-specific CSS duplication: Upload, AI Review, Progress, and Completion currently use separate CSS modules with similar layout rules.
- CSS-drawn passport illustration: Mission currently relies on a code-drawn visual that may be hard to match precisely if Figma uses a bitmap or brand-approved asset.
- Motion matching: AI Review uses timed state transitions and subtle progress motion, so Figma timing needs to be translated without changing the existing flow logic.
- Login component split: Login uses `LoginExperience.tsx` plus a route wrapper, so V3 changes should target the component while keeping route behavior stable.

## Non-Goals For This Preparation Pass

- No UI changes
- No page changes
- No route changes
- No business logic changes
- No new features
