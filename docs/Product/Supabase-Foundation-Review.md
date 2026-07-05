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

- `/intake` final submit is now followed by a server-side submit route in the next critical fix.
- Uploaded document metadata is prepared and can be inserted into `visa_documents`.
- A first case event is prepared for `case_events` with:
  - `event_type`: `intake_submitted`
  - `title`: `资料已提交`
- Server-side writes use `SUPABASE_SERVICE_ROLE_KEY`.
- RLS should keep anonymous users from writing directly.

## What Remains Mock

- Real file upload is not implemented.
- File storage bucket integration is not implemented.
- AI review is not connected.
- SMS login is not connected.
- Staff review/admin workflow is not built.
- Customer submission records are not shown back to users yet.

## Test With Supabase Not Configured

This original foundation behavior has been superseded by server-side intake submit. In production, missing Supabase server configuration should show a user-facing submit failure instead of silent success.

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

- Keep submission writes on the server.
- Add transaction/RPC support for stronger atomic writes.
- Add generated Supabase database types.
- Add real file upload to private Supabase Storage.
- Add staff review UI.
- Add status transition events.
- Add Enterprise WeChat notifications.
