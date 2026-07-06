# Internal Notes Review

## Objective

Sprint 10 adds staff-only internal notes for admin case review.

## Files Changed

- `packages/database/supabase/schema.sql`
- `packages/database/supabase/migrations/20260706100000_create_case_notes.sql`
- `apps/customer/app/admin/_lib/adminData.ts`
- `apps/customer/app/admin/_components/InternalNotesPanel.tsx`
- `apps/customer/app/admin/cases/[caseId]/page.tsx`
- `apps/customer/app/admin/admin.module.css`
- `apps/customer/app/api/admin/cases/[caseId]/notes/route.ts`
- `apps/customer/app/api/admin/cases/[caseId]/notes/[noteId]/route.ts`
- `docs/Product/Internal-Notes-Review.md`

## Database

Created `case_notes`:

- `id`
- `case_id`
- `staff_name`
- `content`
- `created_at`
- `updated_at`

The table references `visa_cases(id)` with cascade delete, has an index on `(case_id, created_at desc)`, uses the shared `set_updated_at` trigger, enables RLS, and allows service-role management only.

## Admin UI

Case Detail now includes `Internal Notes` in the staff side column.

Staff can:

- View notes newest first
- Add a note
- Edit a note
- Delete a note

The UI follows the existing NOIR admin style with restrained cards, thin borders, compact controls, and mobile-friendly layout.

## Privacy Boundary

Internal notes are staff-only.

- Customer Case Center does not query `case_notes`.
- `/api/intake/resume` does not expose `case_notes`.
- Timeline continues to use `case_events` only.
- Notes are not inserted into `case_events`.

## API Routes

- `GET /api/admin/cases/[caseId]/notes`
- `POST /api/admin/cases/[caseId]/notes`
- `PATCH /api/admin/cases/[caseId]/notes/[noteId]`
- `DELETE /api/admin/cases/[caseId]/notes/[noteId]`

All routes use the server Supabase client and require `SUPABASE_SERVICE_ROLE_KEY`.

## Verification

Run:

```bash
npm --workspace apps/customer run typecheck
npm --workspace apps/customer run build
```

## Remaining TODO

- Add real staff authentication and role-based authorization before production.
- Replace free-form staff name with authenticated staff identity.
- Add audit logs if notes must become compliance-grade records.
