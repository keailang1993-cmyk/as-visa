# AS VISA Sprint 13 Connected Flow

## Goal

Connect the customer journey into one complete guided sequence.

## Complete Flow

```text
Login
  ↓
Mission
  ↓
Upload Passport
  ↓
AI Review
  ↓
Mission
  ↓
Upload ID
  ↓
AI Review
  ↓
Mission
  ↓
Upload Bank
  ↓
AI Review
  ↓
Completed
  ↓
Timeline
```

## Behavior

- Login resets mission progress to the first mission.
- Mission page displays only the current task.
- Upload page reuses the same upload experience with dynamic mission content.
- AI Review advances the mission automatically.
- Final AI Review routes to Completion.
- Completion routes to Timeline through `View Progress`.
