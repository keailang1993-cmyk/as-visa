# Online MVP QA

## Test URL

- Vercel URL: TBD

## Devices To Test

- iPhone Safari
- Android Chrome
- WeChat iOS WebView
- WeChat Android WebView

## Critical User Journey

1. Open `/`
2. Redirect to `/welcome`
3. Tap `开始办理`
4. Login mock flow
5. View Mission
6. Upload document
7. AI Review
8. Complete all missions
9. View Completion
10. View Progress

## QA Checklist

For each page, check:

- Page loads correctly
- No horizontal scrolling
- Button is tappable
- Text is not too small
- Bottom navigation is not blocked
- Upload button can trigger file/camera picker
- Page looks premium and consistent
- User knows what to do next

Pages:

- Welcome
- Login
- Mission
- Upload
- AI Review
- Completion
- Progress

## Page Checklist

### Welcome

- `/` redirects to `/welcome`.
- `开始办理` is visible and tappable.
- The page communicates a calm, premium first impression.
- Feature items are readable on small screens.

### Login

- Phone input is tappable.
- Verification code input is tappable.
- Mock login continues to Mission.
- Legal copy remains readable.

### Mission

- Only one current task is shown.
- Mission card is tappable.
- User understands the next action.
- Progress copy is readable.

### Upload

- Upload page explains the current document clearly.
- Camera upload button can trigger camera picker where supported.
- Album upload button can trigger file picker.
- Preview and retry states remain usable.
- Trust note is visible or reachable without horizontal scrolling.

### AI Review

- Review state loads immediately after upload.
- Step checklist is readable.
- Motion is calm and not distracting.
- Page automatically advances after completion.

### Completion

- Completion message is clear and reassuring.
- `查看办理进度` is tappable.
- Secondary text is readable.

### Progress

- Timeline loads correctly.
- Current status is clear.
- Text does not overlap.
- Page feels like customer tracking, not an admin dashboard.

## Known MVP Limitations

- SMS login is mocked
- Upload does not store real files
- AI review is simulated
- Progress is static
- No admin workflow yet
- No real customer database yet

## Bug Report Format

For every issue, record:

- Page
- Device
- Browser / WebView
- Screenshot
- Problem
- Priority
- Suggested fix

## Priority Guide

- P0: Blocks the main customer journey.
- P1: Important usability or layout issue on a target device.
- P2: Visual polish issue that does not block testing.
- P3: Minor copy, spacing, or documentation issue.
