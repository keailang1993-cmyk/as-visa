# AS VISA Rule Engine V1

## Purpose

Sprint 16 introduces the foundation for a configurable Rule Engine.

The customer MVP flow still behaves the same. The Mission page continues to show one current task at a time, but the mission list is now generated from rule data instead of being hardcoded inside the customer app.

## Package

`packages/rule-engine`

This package owns visa rule configuration and generation helpers. It does not render UI, call Supabase, call OpenAI, or perform user-specific business decisions.

## Data Structure

Each `VisaRuleSet` contains:

- `country`: country code and display name
- `visaType`: tourism, business, student, or family visit
- `applicantType`: individual, family, minor, or business owner
- `requiredDocuments`: documents that generate customer missions
- `optionalDocuments`: documents available to future flows
- `humanReviewRules`: review conditions for advisor follow-up

Each document rule contains customer-facing upload copy, detection copy, accepted file types, and upload capability flags.

## Sample Rules

V1 includes sample tourism rules for:

- China
- USA
- Japan
- Korea

All sample countries currently share the same required MVP document sequence:

1. Passport
2. ID Card
3. Bank Statement

Optional sample documents include employment letter and travel plan. These are configured for future use, but they do not change the current customer MVP flow.

## Generated Outputs

The engine exposes:

- `generateMissionList(ruleSet)`: creates the one-mission-at-a-time list used by the customer flow
- `generateUploadFlow(ruleSet)`: creates upload steps with route and file capability metadata
- `generateCompletionCondition(ruleSet)`: creates the condition for completing required document collection
- `generateMissionFlow(input)`: returns the complete generated rule output for a country, visa type, and applicant type

## Current Integration

`apps/customer/app/lib/missionFlow.ts` now imports `defaultMissionFlow` from `@as-visa/rule-engine`.

The default rule input is:

- Country: China
- Visa Type: Tourism
- Applicant Type: Individual

This keeps the existing MVP flow unchanged while making the source configurable.

## Boundaries

V1 intentionally does not include:

- Database persistence
- Supabase integration
- OpenAI document extraction
- Admin editing UI
- Dynamic user profile selection
- Real eligibility decisions

## Remaining TODO

- Replace default rule selection with user/order-specific rule selection.
- Store rule sets in PostgreSQL after the schema is ready.
- Add advisor/admin tools for reviewing and versioning rules.
- Connect AI extraction results to human review rules.
- Add tests for rule generation once multiple real visa products exist.
