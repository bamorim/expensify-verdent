# Task: Organization Management UI

## Meta Information

- **Task ID**: `TASK-007`
- **Title**: Organization Management UI
- **Status**: `Not Started`
- **Priority**: `P1`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 2 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR1, FR2)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Build comprehensive UI for organization management including listing, creation, member invitation, and member management. This allows admins to manage their organization and users to create and join organizations.

## Acceptance Criteria

- [ ] Organization list page displays user's organizations
- [ ] Organization creation form functional with validation
- [ ] Member list displays all organization members with roles
- [ ] Member invitation works (email input, sends invite)
- [ ] Invitation acceptance flow functional
- [ ] Organization settings page for admin-only changes
- [ ] Admin-only operations properly restricted
- [ ] All forms validated client and server side
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling with helpful messages
- [ ] Loading states and feedback

## TODOs

### Organization List Page
- [ ] Update/complete `src/app/(app)/organizations/page.tsx`
- [ ] Fetch: Use tRPC to list user's organizations
- [ ] Display: List/grid of organizations with:
  - Organization name
  - Member count
  - "Manage" or "View" button
  - "Leave organization" option (if not admin)
- [ ] Add: "Create New Organization" button
- [ ] Empty state: Message when user has no organizations
- [ ] Loading state: Show skeleton/spinner while fetching
- [ ] On org click: Navigate to org dashboard

### Organization Creation Page
- [ ] Complete `src/app/(app)/organizations/new/page.tsx`
- [ ] Form fields:
  - [ ] Organization name (required, min 2 chars, max 100)
- [ ] Form submission:
  - [ ] Call tRPC create procedure
  - [ ] Show loading state during submission
  - [ ] Handle errors with helpful messages
  - [ ] On success: Redirect to org dashboard
- [ ] Validation:
  - [ ] Client-side: Name length, required field
  - [ ] Server-side: Already enforced by router
- [ ] Form styling: Consistent with app design

### Organization Dashboard/Settings
- [ ] Create `src/app/orgs/[orgId]/settings/page.tsx` or similar
- [ ] Display:
  - Organization details (name, created date, member count)
  - Organization ID (for reference)
- [ ] Admin-only actions:
  - [ ] Update organization name
  - [ ] Invite users section
  - [ ] Member management section
- [ ] Member list:
  - [ ] Display all members with:
    - Name/email
    - Role (Admin, Member)
    - Joined date
  - [ ] Admin-only: Change member role
  - [ ] Admin-only: Remove member
- [ ] Invite users section:
  - [ ] Email input field
  - [ ] "Send Invitation" button
  - [ ] Show success message on send
  - [ ] Show list of pending invitations
  - [ ] Validation: Valid email format

### Invitation Management
- [ ] Create invitation acceptance flow
  - [ ] Add query parameter to invitation link (token)
  - [ ] Create page to accept invitation
  - [ ] Show organization name and invitation details
  - [ ] "Accept" button to join org
  - [ ] On accept: Call tRPC acceptInvitation
  - [ ] On success: Redirect to org dashboard
  - [ ] Error handling: Invalid/expired token

### Org Selector Component
- [ ] Complete `src/app/_components/org-selector.tsx`
- [ ] Display: Current organization name
- [ ] Dropdown showing:
  - [ ] All user's organizations (links to each)
  - [ ] "Create New Organization" option
  - [ ] Organization switcher functionality
- [ ] On org select: Navigate to `/orgs/[id]/dashboard`
- [ ] Mobile-responsive dropdown

### Forms & Validation
- [ ] Use Zod for schema validation (client-side with react-hook-form)
- [ ] All forms with:
  - [ ] Clear label text
  - [ ] Helpful placeholder text
  - [ ] Error messages from validation
  - [ ] Disabled submit during submission
  - [ ] Success/error toast or inline messages
- [ ] Consistent form styling with Tailwind

### Accessibility
- [ ] All form inputs have associated labels
- [ ] Error messages linked to fields (aria-describedby)
- [ ] ARIA live regions for async feedback
- [ ] Keyboard navigation fully functional
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Test with screen reader

### Responsive Design
- [ ] Mobile (320px): Stacked layout, full-width inputs
- [ ] Tablet (768px): Appropriate spacing and sizing
- [ ] Desktop (1024px+): Multi-column layouts where appropriate
- [ ] Test on actual mobile devices or emulator

### Error Handling
- [ ] Display helpful error messages from API
- [ ] Handle network errors gracefully
- [ ] Handle authorization errors (non-admin trying to manage)
- [ ] Handle not found errors (org doesn't exist)
- [ ] Suggest actions for users (e.g., contact admin)

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-001 and TASK-002 completion
**Next Steps**: Begin implementation after dependencies complete

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Forms fully functional with validation
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility audit passed
- [ ] All user flows tested manually
- [ ] Error cases handled properly
- [ ] Code review completed
- [ ] Ready for integration testing

## Notes

- Organization creation should automatically make creator an admin
- Non-admins should see member list but not management controls
- Consider adding organization description field (future enhancement)
- Email invitations require email service configured (from TASK-001)
- Test both admin and non-admin user flows
- Loading states improve perceived performance

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
