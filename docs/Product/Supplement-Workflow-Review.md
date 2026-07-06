# Supplement Workflow Review

## Objective

Implement the first real supplement document workflow so staff can request missing documents and customers can upload only the requested files without restarting the full intake.

## What Changed

- Added `supplement_requests` database table.
- Added Admin `Request Supplement` action in case detail.
- Added Admin supplement request modal with document selection and message textarea.
- Added server route to create supplement requests.
- Added customer supplement detection on `/intake`.
- Added customer Supplement Center for active supplement requests.
- Added server route for supplement lookup and supplement upload submit.
- Added timeline events for:
  - `Supplement requested`
  - `Supplement uploaded`

## Database

New table:

- `supplement_requests`

Columns:

- `id`
- `case_id`
- `status`
- `message`
- `requested_documents`
- `created_at`
- `completed_at`

The table has RLS enabled and service-role-only access, matching the current MVP backend pattern.

## Admin Flow

1. Staff opens `/admin/cases/[caseId]`.
2. Staff clicks `Request Supplement`.
3. Staff selects missing documents:
   - Passport
   - ID Card
   - Bank Statement
   - Photo
   - Others
4. Staff writes the supplement message.
5. System creates a `supplement_requests` row.
6. System updates `visa_cases.status` to `need_more_docs`.
7. System inserts a `case_events` row:
   - `event_type`: `supplement_requested`
   - `title`: `Supplement requested`

## Customer Flow

Customer opens the intake link with either:

```text
/intake?caseId={caseId}
```

or:

```text
/intake?caseCode={caseCode}
```

If an active supplement request exists, the customer sees Supplement Center instead of the normal intake flow.

The customer only uploads requested files. They do not refill profile or restart intake.

## Submit Behavior

On supplement submit:

1. Files upload to private Supabase Storage bucket `as-visa-documents`.
2. New `visa_documents` rows are inserted.
3. `supplement_requests.status` becomes `completed`.
4. `supplement_requests.completed_at` is set.
5. `visa_cases.status` returns to `reviewing`.
6. A `case_events` row is inserted:
   - `event_type`: `supplement_uploaded`
   - `title`: `Supplement uploaded`

## Files Changed

- `packages/database/supabase/schema.sql`
- `apps/customer/app/admin/_components/SupplementRequestForm.tsx`
- `apps/customer/app/admin/cases/[caseId]/page.tsx`
- `apps/customer/app/admin/admin.module.css`
- `apps/customer/app/api/admin/cases/[caseId]/supplement-request/route.ts`
- `apps/customer/app/api/intake/supplement/route.ts`
- `apps/customer/app/intake/intakeService.ts`
- `apps/customer/app/intake/page.tsx`
- `apps/customer/app/intake/intake.module.css`
- `docs/Product/Supplement-Workflow-Review.md`

## MVP Notes

- Customer supplement detection currently relies on a link containing `caseId` or `caseCode`.
- Admin authentication and role-based authorization are still required before production.
- Supplement upload uses existing private Supabase Storage.
- No database schema changes were made to existing tables.

## How To Test

1. Submit a customer intake with files.
2. Open `/admin/cases`.
3. Open a case detail page.
4. Click `Request Supplement`.
5. Select one or more missing documents.
6. Submit a supplement message.
7. Confirm case status becomes `need_more_docs`.
8. Confirm timeline shows `Supplement requested`.
9. Open `/intake?caseId={caseId}`.
10. Confirm Supplement Center appears.
11. Upload requested files only.
12. Submit supplement.
13. Confirm request becomes `completed`.
14. Confirm case status becomes `reviewing`.
15. Confirm timeline shows `Supplement uploaded`.

## Remaining TODO

- Generate staff-facing supplement links automatically.
- Add real staff authentication before exposing admin routes.
- Add role-based checks before creating supplement requests.
- Add customer identity verification for supplement links.
- Add Enterprise WeChat notification after supplement request creation.
- Add admin display for active/completed supplement requests.
