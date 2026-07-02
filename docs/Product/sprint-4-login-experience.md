# AS VISA Sprint 4 Login Experience

## Goal

Users can log in with their phone number and SMS verification code.

## Scope

Sprint 4 implements one login screen and one placeholder mission destination. It does not build dashboard, workflow, admin, or real SMS authentication logic.

## Experience

- Centered AS VISA logo.
- Phone input.
- SMS verification code input.
- Primary continue button.
- Minimal status message.
- Successful local verification routes to `/mission`.

## Acceptance Criteria

- Login is one screen.
- Login follows NOIR tokens and reusable UI components.
- Layout is responsive.
- Primary action is disabled until phone and 6 digit code are present.
- Successful submit navigates to a placeholder Mission page.
