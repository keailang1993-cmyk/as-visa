# Upload Preview Fix

## Problem

During online MVP testing, the upload preview / feedback state became visually messy after selecting a document image.

The user could not clearly identify or tap the next action, which blocked the core customer journey:

`/mission -> /upload -> select image -> preview -> confirm image -> /ai-review`

## Root Cause

- The preview state reused a generic document preview component inside an additional card.
- The preview image could consume too much vertical space on a `390px` mobile viewport.
- The confirmation buttons competed with the bottom navigation.
- The primary action was not visually dominant enough for the upload confirmation step.

## Files Changed

- `apps/customer/app/upload/page.tsx`
- `apps/customer/app/upload/upload.module.css`
- `docs/Product/Upload-Preview-Fix.md`
- `docs/Design/screenshots/upload-preview-fix/01-upload-idle.png`
- `docs/Design/screenshots/upload-preview-fix/02-upload-preview.png`
- `docs/Design/screenshots/upload-preview-fix/03-upload-success.png`

## What Was Fixed

- Rebuilt the upload preview state as a dedicated confirmation screen.
- Added page title: `请确认这张照片`.
- Added description: `确认照片清晰后，我们将继续进行 AI 初步检查。`
- Added a controlled image preview card.
- Set the preview image to `object-fit: contain`.
- Added mobile-safe max height for the preview image.
- Added checklist items:
  - 四角完整
  - 文字清晰
  - 无反光
  - 无模糊
- Added full-width primary action: `使用这张照片`.
- Added secondary action: `重新上传`.
- Hid bottom navigation during preview and success states to keep the confirmation action clear.
- Updated success feedback to a short clean state:
  - `资料已收到`
  - `正在进入 AI 初步检查。`

## Mobile Viewport Testing Notes

- Target viewport: `390px` width.
- Upload idle, preview, and success states were captured for visual QA.
- Preview state avoids horizontal scrolling.
- Preview image is contained inside its card and does not cover buttons.
- Primary CTA remains visible and tappable.
- Bottom safe-area padding is included for mobile / WeChat WebView.

## Remaining TODO

- Test actual camera picker behavior on iPhone Safari.
- Test actual camera picker behavior inside WeChat iOS WebView.
- Test actual file picker behavior on Android Chrome and WeChat Android WebView.
- Validate large portrait and landscape document photos on real devices.
