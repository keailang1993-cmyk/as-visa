# AS VISA Sprint 1 Project Architecture

AS VISA is an AI-first visa delivery platform. The architecture is organized around guided missions instead of CRM-style record management.

## Project Architecture

- `apps/customer`: Customer-facing Next.js application shell.
- `apps/admin`: Internal admin Next.js application shell.
- `packages/ui`: Shared component library and design tokens.
- `packages/ai`: OpenAI API orchestration and AI-first guidance layer.
- `packages/rule-engine`: Visa rule evaluation package.
- `packages/upload`: Document upload and file processing package.
- `packages/config`: Shared app, environment, lint, TypeScript, and Tailwind configuration.
- `packages/database`: Supabase and PostgreSQL schema ownership.
- `docs/Product`: Product philosophy, mission flows, and platform behavior.
- `docs/Design`: Design system notes, UX principles, and component guidance.
- `docs/AI`: AI behavior, prompt strategy, model policies, and evaluation notes.
- `docs/Development`: Engineering architecture, setup notes, and implementation decisions.
- `public`: Public runtime assets served by Next.js apps.
- `assets`: Source assets used to produce product media, icons, or documentation material.

## Folder Tree

```text
apps/
  customer/
  admin/
packages/
  ui/
  ai/
  rule-engine/
  upload/
  config/
  database/
docs/
  Product/
  Design/
  AI/
  Development/
public/
assets/
```
