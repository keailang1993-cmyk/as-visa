# Admin File Preview Signed URL Review

## Objective

Allow staff to preview uploaded customer files from the admin case detail page without making the Supabase Storage bucket public.

## API Route Added

- `GET /api/admin/documents/[documentId]/signed-url`

The route uses the server-side Supabase client and `SUPABASE_SERVICE_ROLE_KEY` to read `visa_documents.file_path` and create a temporary signed URL from the private `as-visa-documents` bucket.

## Files Changed

- `apps/customer/app/api/admin/documents/[documentId]/signed-url/route.ts`
- `apps/customer/app/admin/_components/DocumentPreviewButton.tsx`
- `apps/customer/app/admin/cases/[caseId]/page.tsx`
- `apps/customer/app/admin/admin.module.css`
- `docs/Product/Admin-File-Preview-Signed-URL-Review.md`

## Signed URL Behavior

- Bucket: `as-visa-documents`
- Expiry: 5 minutes
- Response:

```json
{
  "signedUrl": "temporary-url",
  "expiresIn": 300
}
```

Error behavior:

- Missing document: `404`
- Empty `file_path`: `400`
- Signed URL generation failure: `500`

## Security Notes

- The Storage bucket remains private.
- `SUPABASE_SERVICE_ROLE_KEY` is only used in the server route.
- The browser only receives a temporary signed URL.
- Signed URLs expire after 5 minutes.
- This is not a replacement for real admin authentication.
- Production still needs staff login, role-based access, audit logging, and stricter authorization before returning signed URLs.

## How To Test

1. Submit a customer intake with files.
2. Confirm `visa_documents.file_path` is not empty.
3. Open `/admin/cases`.
4. Open a case detail page.
5. Click `查看文件` on a document.
6. Confirm the file opens in a new tab.
7. Confirm the `as-visa-documents` bucket remains private.
8. Confirm the signed URL expires after a short time.

## Remaining TODO

- Add production staff authentication.
- Add role-based access checks before signed URL generation.
- Add signed URL audit events.
- Add file type-aware preview UI if inline previews are needed.
- Add rate limiting for admin file preview requests.
