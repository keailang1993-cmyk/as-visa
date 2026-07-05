# Supabase Storage Upload Review

## Problem

The server-side intake submit created database rows, but uploaded customer files were still mock-only. `visa_documents.file_path` did not contain real Supabase Storage paths.

## What Changed

- `/intake` now keeps the selected `File` object in local state.
- Final submit sends `multipart/form-data` to `/api/intake/submit`.
- The submit API creates a visa case first.
- The submit API uploads each selected file to Supabase Storage.
- `visa_documents.file_path` now stores the real private storage path.
- `case_events` still records `intake_submitted`.
- A standalone `/api/intake/upload` route was added for future independent upload/re-upload flows.

## Storage Bucket

- Bucket: `as-visa-documents`
- Visibility: private

## File Path Structure

```text
cases/{caseId}/{documentType}/{timestamp}-{safeFileName}
```

Example:

```text
cases/92e45093-28c2-4420-af1b-0ed5db50/passport/20260705-passport.jpg
```

## Files Changed

- `apps/customer/app/api/intake/submit/route.ts`
- `apps/customer/app/api/intake/upload/route.ts`
- `apps/customer/app/intake/intakeService.ts`
- `apps/customer/app/intake/page.tsx`
- `packages/database/supabase/schema.sql`
- `docs/Backend/SUPABASE_SETUP.md`
- `docs/Product/Supabase-Storage-Upload-Review.md`

## How To Configure Supabase Storage

1. Open Supabase Storage.
2. Create a bucket named `as-visa-documents`.
3. Keep the bucket private.
4. Ensure Vercel has:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## How To Test

1. Deploy the latest code.
2. Confirm Vercel has `SUPABASE_SERVICE_ROLE_KEY`.
3. Confirm Supabase has private bucket `as-visa-documents`.
4. Open `/intake`.
5. Fill basic information.
6. Upload files for all required document cards.
7. Submit.
8. Confirm:
   - `visa_cases` has a new row.
   - `visa_documents` has rows with non-empty `file_path`.
   - files exist in `as-visa-documents`.
   - `case_events` has `intake_submitted`.

## What Remains Mock

- No image preview yet.
- No admin file preview yet.
- No signed URL generation UI yet.
- No AI document review yet.
- No Enterprise WeChat notification yet.

## Remaining TODO

- Add server-side virus/file validation.
- Add image preview and PDF preview if needed.
- Add signed URL generation for staff review.
- Add database RPC transaction to make case, storage, document rows, and event more atomic.
- Add real admin/staff document review workflow.
