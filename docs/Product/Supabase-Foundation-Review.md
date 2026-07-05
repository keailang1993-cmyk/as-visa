# Supabase Foundation Review

## Files Changed

- `.env.example`
- `apps/customer/package.json`
- `apps/customer/app/intake/page.tsx`
- `apps/customer/app/intake/intakeService.ts`
- `packages/database/package.json`
- `packages/database/src/client.ts`
- `packages/database/supabase/schema.sql`
- `docs/Backend/SUPABASE_SETUP.md`
- `docs/Product/Supabase-Foundation-Review.md`

## Tables Created

- `visa_cases`
- `visa_documents`
- `case_events`

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## What Is Connected

- `/intake` final submit now attempts to create a `visa_cases` row.
- Uploaded document metadata is prepared and can be inserted into `visa_documents`.
- A first case event is prepared for `case_events` with:
  - `event_type`: `intake_submitted`
  - `title`: `资料已提交`
- If Supabase is not configured, the page keeps the current local success flow.
- RLS includes temporary anon insert-only policies for the MVP intake path.

## What Remains Mock

- Real file upload is not implemented.
- File storage bucket integration is not implemented.
- AI review is not connected.
- SMS login is not connected.
- Staff review/admin workflow is not built.
- Customer submission records are not shown back to users yet.

## Test With Supabase Not Configured

1. Do not set Supabase environment variables.
2. Run the customer app.
3. Open `/intake`.
4. Complete required fields and mock document uploads.
5. Submit.
6. Confirm the success page still appears.
7. Confirm a warning is logged in the browser console only.

## Test With Supabase Configured

1. Create a Supabase project.
2. Run `packages/database/supabase/schema.sql`.
3. Add environment variables to `apps/customer/.env.local`.
4. Restart the customer app.
5. Complete `/intake`.
6. Submit with all required documents.
7. Confirm rows appear in:
   - `visa_cases`
   - `visa_documents`
   - `case_events`

## Verification

- `npm --workspace apps/customer run typecheck`
- `npm --workspace apps/customer run build`

## Remaining TODO

- Move submission writes to a server route before production.
- Replace temporary anon insert policies with server-side writes.
- Add generated Supabase database types.
- Add real file upload to private Supabase Storage.
- Add staff review UI.
- Add status transition events.
- Add Enterprise WeChat notifications.
