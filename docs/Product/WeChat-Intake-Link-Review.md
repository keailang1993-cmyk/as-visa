# WeChat Intake Link Review

## Files Changed

- `apps/customer/app/intake/page.tsx`
- `apps/customer/app/intake/intake.module.css`
- `apps/customer/app/welcome/page.tsx`
- `docs/Product/WeChat-Intake-Link-MVP.md`
- `docs/Product/WeChat-Intake-Link-Review.md`
- `docs/Design/screenshots/wechat-intake-link/01-intake-welcome.png`
- `docs/Design/screenshots/wechat-intake-link/02-basic-info.png`
- `docs/Design/screenshots/wechat-intake-link/03-document-upload.png`
- `docs/Design/screenshots/wechat-intake-link/04-review-submit.png`
- `docs/Design/screenshots/wechat-intake-link/05-submit-success.png`

## Route Added

- `/intake`

The route uses local step state:

1. Welcome / Case Info
2. Basic Information
3. Document Upload
4. Review & Submit
5. Success

## Welcome CTA Update

The `/welcome` primary CTA `开始办理` now routes to:

- `/intake`

instead of:

- `/login`

## Screenshots

- `docs/Design/screenshots/wechat-intake-link/01-intake-welcome.png`
- `docs/Design/screenshots/wechat-intake-link/02-basic-info.png`
- `docs/Design/screenshots/wechat-intake-link/03-document-upload.png`
- `docs/Design/screenshots/wechat-intake-link/04-review-submit.png`
- `docs/Design/screenshots/wechat-intake-link/05-submit-success.png`

## Testing Steps

1. Open `/welcome`.
2. Tap `开始办理`.
3. Confirm navigation to `/intake`.
4. Tap `开始填写`.
5. Fill basic information.
6. Tap `下一步，上传资料`.
7. Upload mock files for all required documents.
8. Tap `下一步，确认提交`.
9. Confirm all uploaded document tags are marked.
10. Tap `确认提交`.
11. Confirm success state appears.

## Remaining TODO

- Test inside WeChat iOS WebView.
- Test inside WeChat Android WebView.
- Replace local state with backend case data.
- Store uploaded files securely.
- Connect document requirements to Rule Engine.
- Connect submit action to staff workflow.
- Define final behavior for `查看提交记录`.

## Confirmation

Existing customer pages were kept:

- `/welcome`
- `/login`
- `/mission`
- `/upload`
- `/ai-review`
- `/completion`
- `/progress`

No backend, SMS, storage, OpenAI, or OCR integration was added.
