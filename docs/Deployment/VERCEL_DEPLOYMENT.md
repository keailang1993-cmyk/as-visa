# Vercel Deployment

## Project Type

AS VISA is an npm workspaces monorepo.

The customer MVP is a Next.js 15 app located at:

- `apps/customer`

Shared packages used by the customer app:

- `packages/ui`
- `packages/rule-engine`

## Vercel Project Settings

Create one Vercel project for the customer app.

Recommended settings:

- Framework Preset: `Next.js`
- Root Directory: `apps/customer`
- Install Command: `cd ../.. && npm install`
- Build Command: `cd ../.. && npm --workspace apps/customer run build`
- Output Directory: leave empty / use Vercel default for Next.js

The customer app includes a minimal Vercel config:

- `apps/customer/vercel.json`

This keeps the Vercel project focused on `apps/customer` while still installing dependencies from the monorepo root.

## Build Command

```bash
cd ../.. && npm --workspace apps/customer run build
```

When running locally from the repository root:

```bash
npm --workspace apps/customer run build
```

## Install Command

```bash
cd ../.. && npm install
```

When running locally from the repository root:

```bash
npm install
```

## Output Directory

No custom output directory is required.

Vercel should use the standard Next.js output generated in:

- `apps/customer/.next`

Do not commit `.next`.

## Environment Variables Needed

No environment variables are required for the current MVP demo flow.

Future production integrations will likely need:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- SMS provider credentials
- File storage credentials

These are not connected yet and should not block the MVP demo deployment.

## Customer Routes To Confirm

- `/`
- `/welcome`
- `/login`
- `/mission`
- `/upload`
- `/ai-review`
- `/completion`
- `/progress`

Expected root behavior:

- `/` redirects to `/welcome`

## Local Verification Steps

From the repository root:

```bash
npm install
npm run typecheck:ui
npm run typecheck:rule-engine
npm --workspace apps/customer run typecheck
npm --workspace apps/customer run build
```

Optional local production check:

```bash
cd apps/customer
npm exec next start -- -p 3000
```

Then open:

- `http://127.0.0.1:3000/welcome`

## Deployment Steps

1. Push the latest code to GitHub.
2. Open Vercel.
3. Choose `Add New Project`.
4. Import the GitHub repository:
   - `keailang1993-cmyk/as-visa`
5. Set Root Directory to:
   - `apps/customer`
6. Confirm Framework Preset:
   - `Next.js`
7. Confirm Install Command:
   - `cd ../.. && npm install`
8. Confirm Build Command:
   - `cd ../.. && npm --workspace apps/customer run build`
9. Leave Output Directory empty.
10. Do not add environment variables for the current MVP demo.
11. Click Deploy.
12. After deployment, open the Vercel URL on a mobile device.
13. Test the full journey from `/welcome` to `/progress`.
14. Test inside WeChat WebView.

## Common Errors And Fixes

### Error: `next: command not found`

Cause:

- Vercel installed dependencies from `apps/customer` only, but the monorepo dependencies are installed from the root.

Fix:

- Confirm Root Directory is `apps/customer`.
- Confirm Install Command is `cd ../.. && npm install`.
- Confirm Build Command is `cd ../.. && npm --workspace apps/customer run build`.

### Error: Cannot resolve `@as-visa/ui` or `@as-visa/rule-engine`

Cause:

- Workspace packages were not installed from the monorepo root.

Fix:

- Use the root install command: `cd ../.. && npm install`.
- Confirm `packages/ui` and `packages/rule-engine` exist in the GitHub repository.

### Error: Build succeeds locally but fails on Vercel

Cause:

- Vercel project settings may not match the monorepo build path.

Fix:

- Confirm Vercel Root Directory is `apps/customer`.
- Confirm `apps/customer/vercel.json` is committed.
- Confirm the Build Command runs from the monorepo root.

### Error: Root route does not show Welcome

Cause:

- User opened `/login` directly, or an older deployment is still cached.

Fix:

- Open `/`.
- Confirm `/` redirects to `/welcome`.
- Redeploy the latest GitHub commit.

### Error: Environment variables missing

Cause:

- Future backend features may expect variables that the MVP does not currently use.

Fix:

- Current MVP demo does not require environment variables.
- Add variables only when Supabase, OpenAI, SMS, or file storage integrations are connected.
