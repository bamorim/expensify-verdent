# Task: Review Workflow UI

## Meta Information

- **Task ID**: `TASK-011`
- **Title**: Review Workflow UI
- **Status**: `Not Started`
- **Priority**: `P1`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 1-2 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR7)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Build the UI for reviewing and approving/rejecting expenses. Admins review pending expenses and can approve or reject them with optional comments. This completes the expense lifecycle user experience.

## Acceptance Criteria

- [ ] Review queue page shows only pending (SUBMITTED) expenses
- [ ] Expense detail view with all relevant information
- [ ] Approve/reject actions functional with optional comments
- [ ] Approval/rejection confirmation feedback
- [ ] Audit trail displayed in expense detail
- [ ] Admin-only operations properly restricted
- [ ] All forms validated client and server side
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling with helpful messages
- [ ] Clear status indicators for reviewed expenses

## TODOs

### Review Queue Page
- [ ] Create `src/app/orgs/[orgId]/reviews/page.tsx`
- [ ] Fetch: Use tRPC to list pending expenses for review
- [ ] Display: Table or card layout with pending expenses:
  - [ ] Submitter name
  - [ ] Category name
  - [ ] Amount (formatted currency)
  - [ ] Description (preview, truncated if long)
  - [ ] Submitted date
  - [ ] Priority indicator (optional - high amounts first?)
  - [ ] "Review" button or click-through to detail
- [ ] Empty state: "No expenses pending review"
- [ ] Loading state: Skeleton/spinner
- [ ] Sort: By submission date (oldest first - longest waiting)
- [ ] Filter options (optional):
  - [ ] By category
  - [ ] By amount range
  - [ ] By submission date range
- [ ] Admin-only: Only show this page/link to admins
- [ ] Count badge: Show number of pending reviews

### Review Detail Page
- [ ] Create `src/app/orgs/[orgId]/reviews/[id]/page.tsx`
- [ ] On load: Fetch expense details
- [ ] Display:
  - [ ] Expense details:
    - [ ] Submitter name and email
    - [ ] Category name
    - [ ] Amount (highlight prominently)
    - [ ] Description
    - [ ] Expense date
  - [ ] Policy information:
    - [ ] Max amount for this category/user
    - [ ] Period (Monthly/Yearly)
    - [ ] Auto-approval setting (for reference)
  - [ ] User's spending in period:
    - [ ] Total spent so far (optional but helpful)
    - [ ] Budget remaining
    - [ ] Progress bar showing usage vs limit
  - [ ] Audit trail:
    - [ ] Submission timestamp
    - [ ] All previous actions (if expense was modified)
- [ ] Review section:
  - [ ] Status header: "Awaiting Your Review"
  - [ ] Approve button
  - [ ] Reject button
  - [ ] Optional comment field (shared for both approve and reject):
    - [ ] Text area
    - [ ] Character counter (optional)
    - [ ] Max 500 chars
- [ ] Navigation:
  - [ ] Back button to review queue
  - [ ] Previous/Next buttons to move between pending reviews (optional)

### Approve Action
- [ ] Approve button triggers:
  - [ ] Optional: Show comment input (inline or modal)
  - [ ] Call tRPC approve procedure with expenseId and optional comment
  - [ ] Show loading state
  - [ ] Handle errors with helpful messages
  - [ ] On success:
    - [ ] Show success message "Expense approved"
    - [ ] Update page to show new status
    - [ ] Show option to "Back to review queue" or "Review next"
    - [ ] Update expense status display to APPROVED (green badge)

### Reject Action
- [ ] Reject button triggers:
  - [ ] Show reason/comment input:
    - [ ] Text area with helpful placeholder (e.g., "Explain why this expense is being rejected")
    - [ ] Required or strongly encouraged
  - [ ] Call tRPC reject procedure with expenseId and comment
  - [ ] Show loading state
  - [ ] Handle errors
  - [ ] On success:
    - [ ] Show success message "Expense rejected"
    - [ ] Update page to show new status
    - [ ] Show option to "Back to review queue" or "Review next"
    - [ ] Update expense status display to REJECTED (red badge)

### Confirmation Dialogs
- [ ] Before approve:
  - [ ] "Approve this expense for ${amount}?" (optional confirmation)
  - [ ] If comment provided, show it will be recorded
  - [ ] Approve and Cancel buttons
- [ ] Before reject:
  - [ ] "Reject this expense?" 
  - [ ] Show comment (required)
  - [ ] Warn that user will see rejection reason
  - [ ] Reject and Cancel buttons

### Status Badges
- [ ] APPROVED: Green badge with checkmark
- [ ] REJECTED: Red badge with X mark
- [ ] SUBMITTED: Yellow badge "Awaiting Review"

### Forms & Validation
- [ ] Comment field:
  - [ ] Optional for approve, required or strongly encouraged for reject
  - [ ] Client-side: Max 500 chars validation
  - [ ] Character counter
  - [ ] Allow empty for approve
- [ ] Form styling:
  - [ ] Clear labels
  - [ ] Helpful placeholders
  - [ ] Error messages
  - [ ] Disabled buttons during submission

### Authorization
- [ ] Admin-only: Check user is admin of org
- [ ] Show "Not authorized" if non-admin tries to access
- [ ] Redirect non-admins from review pages
- [ ] Server-side authorization in tRPC (not just UI)

### Accessibility
- [ ] All inputs have labels
- [ ] Error messages aria-describedby linked
- [ ] Confirmation dialogs have focus trap
- [ ] Keyboard navigation fully functional
- [ ] Focus indicators visible
- [ ] Color contrast WCAG AA
- [ ] Status badges have aria-labels (don't rely on color)
- [ ] Screen reader compatible

### Responsive Design
- [ ] Mobile (320px): Single column layout, stacked buttons
- [ ] Tablet (768px): Two-column info display
- [ ] Desktop (1024px+): Full detail view with sidebar
- [ ] Test on actual devices

### Error Handling
- [ ] API error messages displayed
- [ ] Network error handling
- [ ] Not found errors (expense doesn't exist)
- [ ] Authorization errors (not admin)
- [ ] Already reviewed errors (expense no longer SUBMITTED)
- [ ] Submit errors from tRPC

### User Feedback
- [ ] Loading states for async operations
- [ ] Success toast/message on approve/reject
- [ ] Clear indication of what happened
- [ ] Ability to navigate to next review or back to queue

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-002 (UI shells) and TASK-006 (review router)
**Next Steps**: Begin implementation after dependencies complete

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Review queue functional and showing pending expenses
- [ ] Detail view showing all expense and policy information
- [ ] Approve/reject actions working
- [ ] Comments recorded correctly
- [ ] Admin-only operations properly restricted
- [ ] Responsive on all breakpoints
- [ ] Accessibility audit passed
- [ ] All user flows tested manually
- [ ] Error cases handled properly
- [ ] Code review completed
- [ ] Ready for integration testing

## Notes

- Review workflow is critical for compliance - make it clear and easy to use
- Admin should see all relevant info before making decision
- Comments are important for audit trail - encourage admins to provide them
- Status updates should be clear so admin knows action was successful
- Consider showing user's history of previous expenses in category (future enhancement)
- Test both approve and reject flows thoroughly
- Consider workflow: auto-navigate to next pending review after action (improvement)

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
