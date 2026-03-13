---
description: Rules for React components in components/ and app/
globs: "{components,app}/**/*.tsx"
---

# Component Conventions

## Dashboard Stat Cards
Use `DashboardStatCard` from `@/components/shared/DashboardStatCard` — it is the single source of truth.
Props: `icon`, `title`, `value`, `color`, `subtitle?`, `trend?`. There is NO `bgColor` prop.

## Video Components
Video call components live in `components/video/` — ONE shared component for all user types. Never duplicate.

## Mobile Bottom Tabs Pattern
For dashboard tab components, use fixed bottom tab bar on mobile (NOT accordion):
```tsx
<div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-1 z-50 shadow-lg">
  {tabs.map(tab => (...))}
</div>
```
Add `pb-20 sm:pb-0` to content div to prevent overlap.

## Shared Components
- `PaymentMethodForm` — MCB Juice + card, used by all user types
- `GenericMessagesPage` — thin wrapper for ChatView, reused across all dashboards
- `SettingsLayout` — config-driven tabs, shared by all user types

## Imports
- Use `@/*` path alias (maps to project root)
- Dynamic import video components with `{ ssr: false }`
