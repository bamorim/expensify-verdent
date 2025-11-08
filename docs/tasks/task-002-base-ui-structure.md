# Task: Base UI Structure & App Shells

## Meta Information

- **Task ID**: `TASK-002`
- **Title**: Base UI Structure & App Shells
- **Status**: `Not Started`
- **Priority**: `P0`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 1-2 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md`
- **Architecture**: `/docs/technical/architecture.md`

## Description

Create the foundational UI structure with three distinct app shells:
1. **Landing Page**: Public page with login/app redirect buttons
2. **Non-Org Shell**: For users without an organization or user-specific pages
3. **Org-Specific Shell**: Main app shell with sidebar navigation and org context

This task establishes the routing structure and layout foundations for all subsequent UI tasks.

## Acceptance Criteria

- [ ] Landing page created with conditional auth-based buttons
- [ ] Non-org shell layout created for `/app/*` routes
- [ ] Org-specific shell layout created for `/orgs/[orgId]/*` routes
- [ ] Organization selector component in org shell (with org switcher dropdown)
- [ ] Sidebar navigation menu in org shell with placeholder links
- [ ] Placeholder pages created (dashboard, categories, policies, expenses, reviews)
- [ ] Route protection middleware implemented
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Responsive design across breakpoints
- [ ] All pages render without errors

## TODOs

### Landing Page
- [ ] Update `src/app/page.tsx`
  - Remove T3 app template content
  - Add simple hero section
  - Add conditional button: "Login" (if no session) or "Go To App" (if session)
  - Add basic styling with Tailwind

### Non-Org Shell Routes
- [ ] Create `src/app/(app)/layout.tsx`
  - Simple header with user info and sign out
  - Content area
  - No sidebar navigation
- [ ] Create `src/app/(app)/organizations/page.tsx`
  - Organization list
  - "Create New Organization" button
  - Links to each org dashboard
- [ ] Create `src/app/(app)/organizations/new/page.tsx`
  - Organization creation form (placeholder)
  - Form fields: name
  - Submit button

### Org-Specific Shell Routes
- [ ] Create `src/app/orgs/[orgId]/layout.tsx`
  - Organization context/selector at top
  - Sidebar with navigation menu
  - Main content area
  - Org selector dropdown that redirects to `/orgs/[id]/dashboard`
  - Navigation links to:
    - Dashboard (`/orgs/[orgId]/dashboard`)
    - Categories (`/orgs/[orgId]/categories`)
    - Policies (`/orgs/[orgId]/policies`)
    - Expenses (`/orgs/[orgId]/expenses`)
    - Reviews (`/orgs/[orgId]/reviews`)
  - User menu (org settings, sign out)
- [ ] Create `src/app/orgs/[orgId]/dashboard/page.tsx`
  - Dashboard placeholder content
  - Summary cards (expense count, pending reviews, etc.)
- [ ] Create `src/app/orgs/[orgId]/categories/page.tsx`
  - Categories list placeholder
  - "Create Category" button placeholder
- [ ] Create `src/app/orgs/[orgId]/policies/page.tsx`
  - Policies list placeholder
  - "Create Policy" button placeholder
- [ ] Create `src/app/orgs/[orgId]/expenses/page.tsx`
  - Expenses list placeholder
  - "Submit Expense" button placeholder
- [ ] Create `src/app/orgs/[orgId]/reviews/page.tsx`
  - Pending reviews list placeholder
  - "Review Details" placeholder

### Org Selector Component
- [ ] Create `src/app/_components/org-selector.tsx`
  - Displays current org name
  - Dropdown showing list of user's orgs
  - Quick navigation to each org
  - "Create New Organization" option
  - Responsive for mobile

### Route Protection
- [ ] Create middleware that:
  - Redirects unauthenticated users to landing page
  - Verifies user is org member before allowing `/orgs/[orgId]/*` access
  - Redirects to organization list if user tries to access non-existent org
- [ ] Apply middleware to protected routes

### Styling & Accessibility
- [ ] Ensure all pages use Tailwind CSS
- [ ] Add semantic HTML (header, nav, main, section)
- [ ] Implement proper heading hierarchy (h1, h2, etc.)
- [ ] Add ARIA labels where needed
- [ ] Test keyboard navigation
- [ ] Color contrast compliance (WCAG AA)
- [ ] Responsive mobile design (test at 320px, 768px, 1024px, 1440px)

### Documentation
- [ ] Document routing structure
- [ ] Document app shell layouts
- [ ] Update README with new route examples

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-001 completion
**Next Steps**: Begin landing page implementation after TASK-001

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] No TypeScript errors
- [ ] All placeholder pages render
- [ ] Route protection working
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility audit passed
- [ ] Ready for subsequent UI tasks

## Notes

- Placeholder pages should be simple - just enough to render and navigate
- Org selector should use tRPC to fetch user's organizations (from TASK-001)
- Consider using a component library or custom components for sidebar/header for consistency
- Route protection can be simple initially (check session + org membership)
- All pages will be replaced with full implementations in subsequent tasks

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
