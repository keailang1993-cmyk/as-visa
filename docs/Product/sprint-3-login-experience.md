# AS VISA Sprint 3 Login Experience

## Objective

Create the first customer-facing experience for AS VISA: a calm, guided login flow that communicates one mission at a time.

## User Story

As a visa applicant, I want to securely access my case with minimal decisions, so that I can continue the one next mission AS VISA needs from me.

## Interaction

The flow has two steps:

1. Identity: the user chooses email or phone and enters the matching contact value.
2. Verification: the user enters a 6 digit one-time code.

Sprint 3 keeps authentication local to interface state. Supabase authentication will be connected later.

## UI Layout

The page uses NOIR components only. Desktop has mission copy, a focused login panel, and an AI guidance note. Mobile is a single column.

## Animation

The copy and panel fade in with subtle upward motion. Loading uses the NOIR spinner. Motion respects `prefers-reduced-motion`.

## Accessibility

- Semantic `main` region.
- Visible `h1`.
- Proper input labels.
- `aria-pressed` on login method controls.
- `aria-live="polite"` status updates.
- Disabled submit buttons until each step is valid.

## Acceptance Criteria

- `/login` exists inside `apps/customer`.
- `/` redirects to `/login`.
- The page uses NOIR Design System components from `@as-visa/ui`.
- The user can choose email or phone.
- The user can continue only after entering an identity value.
- The user can enter a 6 digit verification code.
- The user can return from verification to identity entry.
- No database, Supabase, or OpenAI calls are made in Sprint 3.

## Definition of Done

- Customer app shell exists with Next.js app router files.
- Login route is responsive.
- Login interaction is implemented without backend coupling.
- The implementation follows Sprint 1 architecture and Sprint 2 NOIR Design System.
