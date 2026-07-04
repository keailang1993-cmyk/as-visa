# MVP Demo QA

## Full Customer Journey

1. Open `/welcome`
2. Tap `开始办理`
3. Log in from `/login`
4. Review the current task on `/mission`
5. Upload the current document on `/upload`
6. Wait for AI review on `/ai-review`
7. Return to `/mission` for the next document or continue to `/completion`
8. Open `/progress` to view read-only progress

## Test Steps

| Step | Route | Action | Expected Result |
| --- | --- | --- | --- |
| 1 | `/` | Open customer app root | Redirects to `/welcome` |
| 2 | `/welcome` | Review welcome content | Shows headline, subtitle, three feature items, and `开始办理` CTA |
| 3 | `/welcome` | Tap `开始办理` | Navigates to `/login` |
| 4 | `/login` | Enter phone number and 6-digit code | `继续办理` starts mock login and navigates to `/mission` |
| 5 | `/mission` | Review the mission card | Shows only one current task |
| 6 | `/mission` | Tap the mission card | Navigates to `/upload` |
| 7 | `/upload` | Choose camera or album upload | Shows preview after selecting a photo |
| 8 | `/upload` | Confirm selected photo | Shows success state, then navigates to `/ai-review` |
| 9 | `/ai-review` | Wait for review states | Shows AI review progress, then advances the mission flow |
| 10 | `/mission` | Repeat document flow | Passport, ID card, and bank statement missions complete in order |
| 11 | `/completion` | Review completion message | Shows confirmation and `查看办理进度` CTA |
| 12 | `/progress` | Open progress page | Shows read-only timeline and current advisor review status |

## Mobile Viewport Checklist

- Test at `390px` width.
- Confirm no horizontal scrolling.
- Confirm primary CTA is visible and tappable.
- Confirm text does not overlap cards or buttons.
- Confirm page content remains readable in a WeChat-sized viewport.
- Confirm all screenshots match the current NOIR visual direction.

## WeChat WebView Checklist

- Use mobile-first layout.
- Avoid hover-only interactions.
- Keep tap targets comfortable.
- Keep one primary CTA per screen.
- Avoid oversized fixed content that blocks the bottom area.
- Confirm upload controls work with mobile camera and photo picker behavior.

## Known MVP Limitations

- Login is mocked and does not call SMS authentication.
- Upload stores no real document file.
- AI Review is a timed local simulation.
- Progress data is static demo content.
- Advisor review is not connected to an operations workflow.
- Notifications and profile are not part of the primary demo path.

## What Is Mock Data

- Customer name on Mission page.
- Mission checklist generated from default sample rule data.
- Document upload success state.
- AI review states and timing.
- Progress timeline statuses.
- Estimated advisor review time.

## What Is Not Connected Yet

- Supabase authentication.
- SMS provider.
- Real file storage.
- OCR service.
- OpenAI document review.
- Advisor/admin workflow.
- Notification delivery.
- Rule selection based on real country, visa type, and applicant profile.
