# Intake Experience Polish

## Product Positioning

`/intake` is the primary customer entry for AS VISA in WeChat and Enterprise WeChat.

It is a WeChat-opened client portal with a premium app-like product experience. It should feel guided, calm, focused, and easy to complete in a few minutes.

## What Changed

- Improved the AS VISA intake header with brand, service subtitle, and visa type chip.
- Replaced the simple 5-dot progress with a compact step indicator showing `第 1 / 5 步` and the current step name.
- Polished each state into a focused card-based screen with one clear primary action.
- Grouped basic information fields into premium card sections.
- Added required-field gating for name, phone, passport number, and occupation.
- Upgraded document upload cards with clear requirements, status labels, upload, and re-upload states.
- Added trust copy for document handling.
- Reworked review into `申请人信息`, `已上传资料`, and `待补充资料` sections.
- Disabled final submission while required documents are missing and added a secondary return action.
- Reworked success state into a reassuring confirmation with status details and a clear MVP note instead of a no-op button.

## Why It Remains A WeChat Link

This experience does not add bottom navigation, dashboard chrome, app tabs, or exploratory navigation. The customer opens one link, follows five guided states, submits information, and can close WeChat after success.

The flow remains lightweight and link-friendly while presenting a more polished, trustworthy product surface.

## App-like Experience Preserved

- Consistent AS VISA header rhythm.
- Compact step progress with current task context.
- Large focused titles and short calm descriptions.
- Card-based sections for forms, upload, review, and status.
- One primary CTA per step.
- 52px inputs, 48px buttons, 16px radius, and NOIR black / white / gray visual rules.
- Safe-area bottom padding for WeChat WebView.

## Files Changed

- `apps/customer/app/intake/page.tsx`
- `apps/customer/app/intake/intake.module.css`
- `docs/Product/Intake-Experience-Polish.md`

## Screenshots

- `docs/Design/screenshots/intake-experience-polish/01-step-1-welcome.png`
- `docs/Design/screenshots/intake-experience-polish/02-step-2-basic-info.png`
- `docs/Design/screenshots/intake-experience-polish/03-step-3-upload.png`
- `docs/Design/screenshots/intake-experience-polish/04-step-4-review-missing.png`
- `docs/Design/screenshots/intake-experience-polish/05-step-4-review-complete.png`
- `docs/Design/screenshots/intake-experience-polish/06-step-5-success.png`

## Testing Steps

1. Open `/intake` at 390px mobile viewport.
2. Confirm the welcome state shows AS VISA, `资料办理`, visa type, and the first step.
3. Tap `开始填写`.
4. Confirm the basic information CTA is disabled until required fields are completed.
5. Fill name, phone, passport number, and occupation.
6. Tap `下一步，上传资料`.
7. Confirm each upload card shows document name, requirement, status, and upload control.
8. Tap `下一步，确认提交` without uploading documents.
9. Confirm missing documents are shown and final submit is disabled.
10. Upload all required mock documents and confirm submission can proceed.
11. Confirm success state shows the submitted status and Enterprise WeChat notification copy.

## Verification

- `npm --workspace apps/customer run typecheck`
- `npm --workspace apps/customer run build`

## Remaining TODO

- Replace mock local upload state with real file storage.
- Persist submitted intake records to the database.
- Connect document checklist to the rule engine.
- Add real Enterprise WeChat notification integration.
- Add a real submitted-record view when backend data is available.
