# Task: Expense Submission UI

## Meta Information

- **Task ID**: `TASK-010`
- **Title**: Expense Submission UI
- **Status**: `Not Started`
- **Priority**: `P1`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 2 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR6)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Build the UI for submitting and viewing expenses. Users can submit new expenses with real-time policy feedback, view their expense history, and track expense status through the approval workflow.

## Acceptance Criteria

- [ ] Expense submission form with all required fields
- [ ] Real-time policy validation feedback
- [ ] Clear status indicators for submitted/approved/rejected
- [ ] Expense list shows all user's expenses with filtering
- [ ] Expense detail view with full information and audit trail
- [ ] Auto-rejection/auto-approval feedback to user
- [ ] All forms validated client and server side
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling with helpful messages
- [ ] Loading states and user feedback

## TODOs

### Expense Submission Form
- [ ] Create `src/app/orgs/[orgId]/expenses/new/page.tsx` or modal
- [ ] Form fields:
  - [ ] Date (date picker)
    - [ ] Default to today
    - [ ] Cannot be future date
  - [ ] Category (dropdown)
    - [ ] Populated from tRPC categories list
    - [ ] Displays category names
  - [ ] Amount (number input)
    - [ ] Required, positive values only
    - [ ] Currency formatting/symbol
  - [ ] Description (text area)
    - [ ] Optional but recommended
    - [ ] Max 500 chars
    - [ ] Character counter
- [ ] Real-time policy display:
  - [ ] As user selects category, fetch applicable policy
  - [ ] Show:
    - [ ] Max amount allowed
    - [ ] Period (Monthly/Yearly)
    - [ ] Review requirement (Auto-approved or Manual review)
    - [ ] How much user has spent in current period (optional)
  - [ ] Update as category changes
  - [ ] Show warning if amount approaches or exceeds limit
- [ ] Form submission:
  - [ ] Call tRPC submit procedure
  - [ ] Show loading state
  - [ ] Handle response with status:
    - [ ] Auto-approved: Green success message with checkmark
    - [ ] Auto-rejected: Red error message explaining it exceeds policy
    - [ ] Pending review: Yellow/blue info message "Awaiting review"
    - [ ] No policy found: Yellow warning message
  - [ ] On success: Show success message and redirect to expense list after 2-3 seconds (or button to navigate)
- [ ] Validation:
  - [ ] Category required
  - [ ] Amount required and > 0
  - [ ] Date required and not future
  - [ ] Server-side: Policy application and rejection

### Expense List Page
- [ ] Create/complete `src/app/orgs/[orgId]/expenses/page.tsx`
- [ ] Fetch: Use tRPC to list user's expenses
- [ ] Display: Table or card layout with:
  - [ ] Date submitted
  - [ ] Category name
  - [ ] Amount (formatted currency)
  - [ ] Status badge:
    - [ ] Green for APPROVED
    - [ ] Red for REJECTED
    - [ ] Yellow for SUBMITTED (pending review)
  - [ ] "View Details" or click-through to detail
  - [ ] Filter options (optional):
    - [ ] By status (All, Pending, Approved, Rejected)
    - [ ] By category
    - [ ] By date range
- [ ] Add: "Submit New Expense" button
- [ ] Empty state: Message when no expenses
- [ ] Loading state: Skeleton/spinner
- [ ] Sort: By date descending (newest first)
- [ ] Pagination: If many expenses (optional for MVP)

### Expense Detail View
- [ ] Create `src/app/orgs/[orgId]/expenses/[id]/page.tsx`
- [ ] On load: Fetch expense details from tRPC
- [ ] Display:
  - [ ] All expense information (date, category, amount, description)
  - [ ] Status with visual indicator
  - [ ] Submitted date/time
  - [ ] Reviewed date/time (if reviewed)
  - [ ] Reviewer name (if reviewed)
  - [ ] Applied policy information:
    - [ ] Policy type (org-wide or user-specific)
    - [ ] Max amount and period
  - [ ] If auto-rejected: Rejection reason
  - [ ] If rejected by reviewer: Comment from reviewer
  - [ ] Audit trail:
    - [ ] All status changes with timestamps
    - [ ] Who reviewed and when
    - [ ] Any comments
- [ ] Actions:
  - [ ] Back button or breadcrumb to expense list
  - [ ] If status is REJECTED and user is submitter: Option to re-submit with changes (future: edit rejected expense)
- [ ] Not found: Handle if expense doesn't exist
- [ ] Authorization: Only show to submitter or admin

### Expense Status Indicators
- [ ] Create visual components for status display:
  - [ ] SUBMITTED: Yellow badge "Awaiting Review"
  - [ ] APPROVED: Green badge "Approved" with checkmark
  - [ ] REJECTED: Red badge "Rejected" with X mark
- [ ] Use consistent colors throughout app
- [ ] Include tooltips explaining status meanings

### Forms & Validation
- [ ] Use Zod for validation with react-hook-form
- [ ] All forms with:
  - [ ] Clear labels
  - [ ] Helpful descriptions
  - [ ] Inline validation feedback
  - [ ] Error messages
  - [ ] Disabled submit during submission
- [ ] Date picker:
  - [ ] Calendar interface or text input with validation
  - [ ] Clear max date (today)
  - [ ] Show date in user's locale
- [ ] Amount input:
  - [ ] Currency formatting
  - [ ] Show max allowed amount below field
  - [ ] Warn if amount exceeds policy (but allow submission for review)
- [ ] Category dropdown:
  - [ ] Show category names clearly
  - [ ] Sort alphabetically

### Real-time Feedback
- [ ] Fetch policy information when category changes
- [ ] Show loading state while fetching
- [ ] Display policy clearly and prominently
- [ ] Update policy display instantly
- [ ] Show warning if amount exceeds limit (but don't prevent submission)

### Accessibility
- [ ] All inputs have associated labels
- [ ] Error messages aria-describedby linked
- [ ] Date picker keyboard accessible
- [ ] Status badges have aria-labels
- [ ] Keyboard navigation fully functional
- [ ] Focus indicators visible
- [ ] Color contrast WCAG AA (don't rely on color alone for status)
- [ ] Screen reader compatible

### Responsive Design
- [ ] Mobile (320px): Stacked form, full-width inputs, card-based list
- [ ] Tablet (768px): Two-column layouts where appropriate
- [ ] Desktop (1024px+): Full multi-column tables/lists
- [ ] Test on actual devices

### Error Handling
- [ ] API error messages displayed
- [ ] Network error handling
- [ ] Invalid category error
- [ ] Policy not found error (but allow submission)
- [ ] Submission failure errors
- [ ] Not found errors (expense doesn't exist)
- [ ] Authorization errors

### User Feedback
- [ ] Success toast/message on submission
- [ ] Different messaging for auto-approval vs manual review
- [ ] Clear explanation of rejection reasons
- [ ] Loading states for all async operations
- [ ] Helpful error messages guiding user action

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-002 (UI shells) and TASK-005 (expense router)
**Next Steps**: Begin implementation after dependencies complete

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Submission form fully functional
- [ ] Real-time policy feedback working
- [ ] Expense list and filtering working
- [ ] Detail view showing all information
- [ ] Status indicators working correctly
- [ ] Responsive on all breakpoints
- [ ] Accessibility audit passed
- [ ] All user flows tested manually
- [ ] Error cases handled properly
- [ ] Code review completed
- [ ] Ready for integration testing

## Notes

- Real-time policy feedback is critical UX feature - test thoroughly
- Status indicators should be accessible to color-blind users
- Auto-rejection should be very clear but not punitive in tone
- Consider showing policy limit visualization (progress bar to max amount)
- Test with various expense amounts to ensure policy feedback accuracy
- Empty state when no expenses should encourage first submission
- Consider adding expense templates for common expenses (future enhancement)

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
