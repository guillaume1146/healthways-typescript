---
description: Add a new dashboard page for a user type with sidebar entry
user-invocable: true
---

# Add Dashboard Page

Create a new dashboard sub-page for a specific user type.

## Arguments
$ARGUMENTS should contain: user type (patient, doctor, nurse, etc.) and page name/purpose.

## Steps

1. Read the user type's sidebar config at `app/{userType}/(dashboard)/sidebar-config.ts`
2. Add a new sidebar item with appropriate icon, label, labelKey (for i18n), color, and href
3. Create the page at `app/{userType}/(dashboard)/{page-name}/page.tsx`
4. If the page needs a domain component, create it in `app/{userType}/(dashboard)/components/`
5. The page should be a thin wrapper:

```tsx
'use client'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState'
import MyComponent from '../components/MyComponent'

export default function MyPage() {
  const { user, loading } = useDashboardUser()
  if (loading || !user) return <DashboardLoadingState />
  return <MyComponent user={user} />
}
```

6. Run `npx tsc --noEmit` to verify
