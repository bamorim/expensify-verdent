# Task: Invitation Management UI

## Meta Information

- **Task ID**: `TASK-014`
- **Title**: Invitation Management UI
- **Status**: `Not Started`
- **Priority**: `P1`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 1.5 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR1: User Management)
- **Dependencies**: TASK-013 (Invitation Router), TASK-007 (Organization Management UI)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Build user interface for invitation management including sending invitations (admin), viewing pending invitations (admin), and accepting invitations (user). Integrates with organization management UI and provides clear flows for both inviting and joining.

## Acceptance Criteria

- [ ] Admins can send invitations from org settings page
- [ ] Admins can view list of pending/accepted/revoked invitations
- [ ] Admins can revoke pending invitations
- [ ] Users can accept invitations via email link
- [ ] Invitation acceptance page shows org details before accepting
- [ ] Error handling for expired/invalid invitation tokens
- [ ] All forms validated client and server side
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Loading states and feedback

## TODOs

### Invitation Section in Org Settings
- [ ] Add invitation section to organization settings page
  - Location: `src/app/orgs/[orgId]/settings/page.tsx` or similar (from TASK-007)
- [ ] Invitation form (admin only):
  - [ ] Email input field with validation
  - [ ] "Send Invitation" button
  - [ ] On submit: Call `invitation.create` tRPC procedure
  - [ ] Show loading state during submission
  - [ ] Success message: "Invitation sent to {email}"
  - [ ] Error handling: email already invited, user already in org
  - [ ] Clear form after successful send
- [ ] Pending invitations list (admin only):
  - [ ] Fetch: Use `invitation.list` tRPC procedure with status=PENDING
  - [ ] Display each invitation:
    - Email address
    - Sent date (relative: "2 days ago")
    - "Revoke" button
  - [ ] Revoke action:
    - Call `invitation.revoke` tRPC procedure
    - Confirmation dialog: "Are you sure?"
    - Update list after revoke
    - Show success message
  - [ ] Empty state: "No pending invitations"
  - [ ] Loading state while fetching
- [ ] Invitation history section (admin only, optional):
  - [ ] Toggle or tab to view accepted/revoked invitations
  - [ ] Show: email, status, sent date, accepted date
  - [ ] Read-only (no actions)

### Invitation Acceptance Flow
- [ ] Create invitation acceptance page:
  - Route: `src/app/invitations/accept/page.tsx`
  - Query param: `token` (from email link)
- [ ] On page load:
  - [ ] Extract token from URL
  - [ ] Call `invitation.getByToken` to preview invitation
  - [ ] Display:
    - Organization name
    - Inviter name
    - "You've been invited to join [Org Name]"
  - [ ] Show loading state during fetch
- [ ] Acceptance action:
  - [ ] "Accept Invitation" button
  - [ ] On click: Call `invitation.accept` tRPC procedure
  - [ ] Show loading state during acceptance
  - [ ] On success:
    - Show success message: "You've joined [Org Name]!"
    - Redirect to organization dashboard after 2 seconds
  - [ ] Error handling:
    - Invalid token: "This invitation link is invalid"
    - Expired: "This invitation has expired"
    - Already accepted: "This invitation has already been used"
    - Email mismatch: "This invitation was sent to a different email"
    - Helpful message and action suggestion
- [ ] Not logged in flow:
  - [ ] If user not authenticated, redirect to login
  - [ ] After login, redirect back to acceptance page
  - [ ] Preserve token in redirect flow

### Email Template Enhancement
- [ ] Ensure invitation email includes:
  - [ ] Clear subject: "Invitation to join [Org Name]"
  - [ ] Inviter name
  - [ ] Organization name
  - [ ] Acceptance link with token
  - [ ] Expiration notice
  - [ ] Professional styling

### Forms & Validation
- [ ] Email input validation:
  - [ ] Client-side: Valid email format (Zod + react-hook-form)
  - [ ] Server-side: Already enforced by router
  - [ ] Show error: "Please enter a valid email address"
- [ ] All forms with:
  - [ ] Clear labels and placeholders
  - [ ] Error messages below inputs
  - [ ] Disabled submit during processing
  - [ ] Success/error toast notifications

### Accessibility
- [ ] Form inputs have associated labels
- [ ] Error messages linked to fields (aria-describedby)
- [ ] ARIA live regions for async feedback
- [ ] Keyboard navigation fully functional
- [ ] Focus management (return to input after error)
- [ ] Color contrast meets WCAG AA
- [ ] Revoke action has confirmation dialog

### Responsive Design
- [ ] Mobile (320px): Full-width inputs, stacked layout
- [ ] Tablet (768px): Appropriate spacing
- [ ] Desktop (1024px+): Multi-column where appropriate
- [ ] Invitation list readable on all sizes

### Error Handling
- [ ] Display helpful error messages:
  - [ ] Email already in organization
  - [ ] Invitation already pending
  - [ ] Invalid/expired token
  - [ ] Email mismatch
  - [ ] Network errors
  - [ ] Authorization errors
- [ ] Suggest actions for each error type
- [ ] Don't expose sensitive system details

### Integration Points
- [ ] Link from organization settings to invitations
- [ ] Update member count after invitation accepted
- [ ] Refresh invitation list after actions
- [ ] Update org selector after joining new org

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-013 and TASK-007 completion
**Next Steps**: Begin implementation after dependencies complete

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Forms fully functional with validation
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility audit passed
- [ ] Both admin and user flows tested manually
- [ ] Error cases handled properly
- [ ] Email flow tested end-to-end
- [ ] Code review completed

## Notes

- Test with both existing and non-existing user emails
- Invitation link should be easy to copy/paste if needed
- Consider adding ability to resend invitation (future)
- May want to show invitation status to invitee ("pending", "accepted")
- Toast notifications improve user experience
- Clear visual distinction between pending and completed invitations
- Admin should see who accepted invitation and when

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
