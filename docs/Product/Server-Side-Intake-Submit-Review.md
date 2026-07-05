# Server-Side Intake Submit Review

## Problem

Production `/intake` submissions showed the success state while Supabase tables stayed empty.

## Root Cause

The client submitted directly from the browser with `NEXT_PUBLIC_SUPABASE_ANON_KEY`. When Supabase rejected the insert, the service silently fell back to mock mode, so users saw success without real persistence.

## Files Changed

- `apps/customer/app/api/intake/submit/route.ts`
- `apps/customer/app/intake/intakeService.ts`
- `apps/customer/app/intake/page.tsx`
- `apps/customer/app/intake/intake.module.css`
- `packages/database/supabase/schema.sql`
- `docs/Backend/SUPABASE_SETUP.md`
- `docs/Product/Supabase-Foundation-Review.md`
- `docs/Product/Server-Side-Intake-Submit-Review.md`

## API Route Added

`POST /api/intake/submit`

The route accepts:

- `basicInfo`
- `documents`

It uses `createServerSupabaseClient()` with `SUPABASE_SERVICE_ROLE_KEY` and inserts:

- `visa_cases`
- `visa_documents`
- `case_events`

The response returns:

- `caseId`
- `caseCode`
- `mode: "supabase"`

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Important: `SUPABASE_SERVICE_ROLE_KEY` must only be used in server code. It must never be exposed to browser code.

## How To Test

1. Run `packages/database/supabase/schema.sql` in Supabase.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
3. Open `/intake`.
4. Complete basic information.
5. Upload mock documents.
6. Submit.
7. Confirm the success page appears.
8. Confirm new rows exist in:
   - `visa_cases`
   - `visa_documents`
   - `case_events`

## Failure Behavior

- Development: failed API submit falls back to mock mode for local demo continuity.
- Production: failed API submit stays on the review step and shows `提交失败，请稍后重试或联系顾问。`

## What Remains Mock

- Real file upload is still not implemented.
- `file_path` remains an empty string for now.
- AI review is not connected.
- SMS login is not connected.
- Admin/staff review is not built yet.

## Remaining TODO

- Add Supabase Storage upload for real files.
- Replace multi-step insert cleanup with a database RPC transaction.
- Add rate limiting and stronger server-side validation.
- Generate Supabase database types.
- Add staff review UI.
