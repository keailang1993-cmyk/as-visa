# Sprint 3 Implementation Notes

Sprint 3 introduces the customer login experience only. It does not implement real authentication, mission routing, Supabase integration, OpenAI calls, or admin surfaces.

## Files

```text
apps/customer/app/login/page.tsx
apps/customer/app/login/LoginExperience.tsx
apps/customer/app/login/login.module.css
```

## Future Work

- Connect identity step to Supabase authentication.
- Replace local verification simulation with OTP verification.
- Route verified users to the first mission.
