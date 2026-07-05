# Admin MVP Review

## Objective

Create the first staff-facing AS VISA admin console for reviewing submitted intake cases, inspecting customer information and document metadata, and updating case status.

## Routes Added

- `/admin`
- `/admin/cases`
- `/admin/cases/[caseId]`
- `POST /api/admin/cases/[caseId]/status`

`/admin` redirects to `/admin/cases`.

## Files Changed

- `apps/customer/app/admin/page.tsx`
- `apps/customer/app/admin/admin.module.css`
- `apps/customer/app/admin/_lib/status.ts`
- `apps/customer/app/admin/_lib/adminData.ts`
- `apps/customer/app/admin/_components/StatusUpdateForm.tsx`
- `apps/customer/app/admin/cases/page.tsx`
- `apps/customer/app/admin/cases/loading.tsx`
- `apps/customer/app/admin/cases/[caseId]/page.tsx`
- `apps/customer/app/api/admin/cases/[caseId]/status/route.ts`
- `docs/Product/Admin-MVP-Review.md`

## Data Sources

- `visa_cases`
- `visa_documents`
- `case_events`

All reads and status updates use the server-side Supabase client with `SUPABASE_SERVICE_ROLE_KEY`.

## Staff Workflow

1. Staff opens `/admin/cases`.
2. Staff filters cases by status.
3. Staff opens a case detail page.
4. Staff reviews case overview, applicant information, uploaded document metadata, file paths, and events.
5. Staff updates the case status from the action panel.

## Status Update Behavior

When staff updates status:

1. `visa_cases.status` is updated.
2. A new `case_events` row is inserted.
3. The event title uses the Chinese status label.
4. The event description is `员工将案件状态更新为：{中文状态}`.

## Security Limitations

Admin authentication is not production-ready yet.

This sprint intentionally does not add full staff login, role management, or audit-grade access control. Before production use, `/admin` must be protected by real authentication and staff authorization.

## Screenshots

- `docs/Design/screenshots/admin-mvp/01-admin-cases-empty-or-list.png`
- `docs/Design/screenshots/admin-mvp/02-admin-case-detail.png`
- `docs/Design/screenshots/admin-mvp/03-admin-status-update.png`

Screenshots were captured from the local production build using representative admin data because local Supabase environment variables were not present in this workspace.

## How To Test

1. Configure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
2. Submit at least one customer intake from `/intake`.
3. Open `/admin/cases`.
4. Confirm the newest case appears first.
5. Open `/admin/cases/{caseId}`.
6. Confirm applicant information, document metadata, file path, and case events render.
7. Update status.
8. Confirm `visa_cases.status` changes in Supabase.
9. Confirm a new `case_events` row is created.

## Remaining TODO

- Add production staff authentication.
- Add role-based access control.
- Add signed URL file preview for private Supabase Storage files.
- Add staff comments and internal notes.
- Add richer filters, search, and pagination.
- Add Enterprise WeChat status notifications.
