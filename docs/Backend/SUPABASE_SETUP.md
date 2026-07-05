# Supabase Setup

## Project

AS VISA uses Supabase as the MVP data foundation for WeChat intake submissions.

The first persistence scope is:

- Intake case record
- Uploaded document metadata
- Case event log

Staff review workflow, SMS login, and AI checks are intentionally out of scope for this foundation sprint.

## Create A Supabase Project

1. Go to Supabase and create a new project.
2. Choose the closest region to the expected customer and staff location.
3. Save the project URL and API keys from Project Settings.
4. Open SQL Editor.
5. Run `packages/database/supabase/schema.sql`.
6. Confirm the tables exist under the `public` schema.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The server-side intake submit route uses `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. Never expose it in browser code, never prefix it with `NEXT_PUBLIC_`, and only configure it in Vercel environment variables or local server-only env files.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is kept in the template for future browser-side read-only or authenticated flows, but the intake submit path does not use it for database writes.

## Local `.env.local` Example

Create `apps/customer/.env.local` for local customer app testing:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not commit `.env.local`.

## Vercel Environment Variables

Add these variables in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional future variable:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The production `/api/intake/submit` route must have `SUPABASE_SERVICE_ROLE_KEY`; otherwise production submit will fail instead of silently showing success.

## Tables Needed

### `visa_cases`

Stores one intake submission.

Key fields:

- `case_code`
- `visa_type`
- `destination_country`
- `status`
- `applicant_name`
- `applicant_phone`
- `passport_number`
- `occupation_type`
- `source`

Default status is `submitted`.

Default source is `wechat_intake`.

### `visa_documents`

Stores metadata for documents attached to a case.

`file_path` stores the private Supabase Storage path for the uploaded document file.

### `case_events`

Stores a simple immutable event stream for staff visibility later.

The first event is:

- `event_type`: `intake_submitted`
- `title`: `资料已提交`

## Storage Bucket

Create this private bucket in Supabase Storage:

- `as-visa-documents`

The bucket must be private.

Recommended path format:

```text
cases/{case_id}/{document_type}/{timestamp}-{safe_file_name}
```

Example:

```text
cases/92e45093-28c2-4420-af1b-0ed5db50/passport/20260705-passport.jpg
```

Do not make customer document buckets public.

## Create Storage Bucket

In the Supabase dashboard:

1. Open Storage.
2. Create a new bucket.
3. Bucket name: `as-visa-documents`
4. Public bucket: off.
5. Save.

The server upload route uses `SUPABASE_SERVICE_ROLE_KEY`, so it can upload to the private bucket without exposing storage permissions to the browser.

## Storage Policies

For the current MVP, browser clients should not upload or read files directly. Server routes use the service role key and bypass storage RLS.

Do not add public read policies for `as-visa-documents`.

Future staff/admin previews should use signed URLs generated server-side, for example:

```text
createSignedUrl(file_path, expiresInSeconds)
```

Signed URLs should be short-lived and only returned to authorized staff users.

## RLS Notes

The schema enables RLS on all MVP tables.

Current SQL includes:

- service-role policies for full server-side management

Anonymous users are not granted insert/read/update/delete access in this schema. Intake submission is handled by the server route with the service role key.

## MVP Security Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Store files only in the private `as-visa-documents` bucket.
- Treat all intake values as untrusted user input.
- Add rate limiting before public launch.
- Add server-side validation before staff workflow starts.

## Future Production Notes

- Keep intake submission behind a Next.js server route.
- Use service role only on the server.
- Generate database types from Supabase.
- Generate signed URLs server-side for staff document preview.
- Add document virus scanning or file validation.
- Add staff-only read policies.
- Add audit events for every status change.
- Add Enterprise WeChat notification integration.
