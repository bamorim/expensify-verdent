# Task: Expense Submission Router

## Meta Information

- **Task ID**: `TASK-005`
- **Title**: Expense Submission Router
- **Status**: `Not Started`
- **Priority**: `P0`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 2 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR6: Expense Submission)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Implement the tRPC router for expense submission and retrieval. When an expense is submitted, the system automatically applies policies: expenses over the limit are auto-rejected, compliant expenses either auto-approve or enter manual review based on policy, and all changes are recorded in the audit trail.

## Acceptance Criteria

- [ ] Expense router created with all required procedures
- [ ] Expense submission applies policies automatically
- [ ] Over-limit expenses auto-rejected with reason
- [ ] Compliant expenses auto-approved or routed to review per policy
- [ ] All expense state changes recorded in audit trail
- [ ] Users can only view their own expenses and list org expenses
- [ ] All inputs validated with Zod schemas
- [ ] Comprehensive tests including policy application scenarios
- [ ] Proper error handling
- [ ] No TypeScript errors

## TODOs

### Router Implementation
- [ ] Create `src/server/api/routers/expense.ts`
- [ ] Import: createTRPCRouter, protectedProcedure, TRPCError
- [ ] Import: z for Zod schemas
- [ ] Import policy resolution helpers from policy router
- [ ] Create input schemas:
  - [ ] submitInput: { orgId, categoryId, amount: number, date: Date, description: string }
  - [ ] listInput: { orgId, userId?: string } (filter by user if provided)
  - [ ] getByIdInput: { id }
  - [ ] listForReviewInput: { orgId } (only expenses in SUBMITTED status)

### Procedures
- [ ] Implement `submit` procedure (core business logic)
  - Input: orgId, categoryId, amount, date, description
  - Check: User is member of org
  - Check: Category belongs to org
  - Validation: amount > 0, date is reasonable
  - Fetch: Applicable policy for (org, user, category)
  - Auto-rejection: If amount > policy.maxAmount
    - Create Expense with status REJECTED, reason "Over limit"
    - Create audit entry
    - Return expense with rejection info
  - Auto-approval: If amount <= policy.maxAmount and policy.autoApprove = true
    - Create Expense with status APPROVED
    - Create audit entry
    - Return expense with approval info
  - Manual review: If amount <= policy.maxAmount and policy.autoApprove = false
    - Create Expense with status SUBMITTED
    - Create audit entry
    - Return expense with "awaiting review" message
  - If no policy found:
    - Create Expense with status SUBMITTED (default to manual review)
    - Create audit entry
    - Return expense with "no policy found" note
- [ ] Implement `list` procedure
  - Input: orgId, optional userId
  - Check: User is member of org
  - If userId provided: only return that user's expenses
  - If not provided: return all org expenses (for admins/reviewers)
  - Return: List of expenses with related data (category name, user name, etc.)
- [ ] Implement `getById` procedure
  - Input: id
  - Check: User is member of org owning expense or is admin
  - Return: Expense with full details, related objects, audit trail
- [ ] Implement `listForReview` procedure
  - Input: orgId
  - Check: User is member of org (or admin for actual reviews)
  - Return: Only expenses with status SUBMITTED, ordered by submission date
  - Include: Expense details, category, submitting user, current policy

### Audit Trail
- [ ] Create helper function `createAuditEntry`
  - Record: expenseId, action (SUBMITTED|AUTO_APPROVED|AUTO_REJECTED|etc), details, timestamp
  - Store in database (could be separate AuditLog table or denormalized in Expense)
- [ ] Record audit trail for:
  - [ ] Expense submission
  - [ ] Auto-approval action
  - [ ] Auto-rejection action
  - [ ] Manual approval (from TASK-006)
  - [ ] Manual rejection (from TASK-006)

### Integration with Root Router
- [ ] Register expenseRouter in `src/server/api/root.ts`

### Testing
- [ ] Create `src/server/api/routers/expense.test.ts`
- [ ] Import shared vitest setup from TASK-001
- [ ] Test helpers:
  - [ ] Reuse: createTestOrg, createTestUser, createTestCategory, createTestPolicy
  - [ ] New: createTestExpense
- [ ] Test submit procedure - auto-rejection:
  - [ ] Expense over limit is auto-rejected
  - [ ] Rejection reason recorded
  - [ ] Audit entry created
  - [ ] Returns REJECTED status
- [ ] Test submit procedure - auto-approval:
  - [ ] Compliant expense with autoApprove=true is auto-approved
  - [ ] Approval recorded
  - [ ] Audit entry created
  - [ ] Returns APPROVED status
- [ ] Test submit procedure - manual review:
  - [ ] Compliant expense with autoApprove=false goes to review
  - [ ] Status is SUBMITTED
  - [ ] Audit entry created
  - [ ] Can be retrieved from listForReview
- [ ] Test submit procedure - no policy:
  - [ ] Expense defaults to SUBMITTED if no policy found
  - [ ] Note about missing policy included
  - [ ] Audit entry created
- [ ] Test submit procedure - validation:
  - [ ] Fails if amount <= 0
  - [ ] Fails if category doesn't exist
  - [ ] Fails if user not member of org
  - [ ] Fails if date is invalid
- [ ] Test list procedure:
  - [ ] Lists all org expenses when no userId filter
  - [ ] Lists only user's expenses when userId provided
  - [ ] Non-members cannot list
  - [ ] Expenses ordered properly
- [ ] Test getById procedure:
  - [ ] Returns expense by id
  - [ ] Includes audit trail
  - [ ] Non-members cannot access
  - [ ] Fails if expense doesn't exist
- [ ] Test listForReview procedure:
  - [ ] Only returns SUBMITTED status expenses
  - [ ] Non-members can see list but not approve/reject (authorization in TASK-006)
  - [ ] Ordered by submission date
- [ ] All tests use transactional DB

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-001 and TASK-004 completion
**Next Steps**: Begin router implementation after TASK-001 and TASK-004

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Policy application logic thoroughly tested
- [ ] Audit trail working correctly
- [ ] Error messages helpful
- [ ] Code review completed
- [ ] Ready for TASK-006 (Review Router) and TASK-010 (Expense UI)

## Notes

- Policy resolution happens at submit time - store which policy was applied in Expense
- Auto-rejection should be immediate and clear to user
- Audit trail is critical for compliance and debugging
- Consider if users should see auto-rejected expenses or if they should be hidden by default
- Can be developed in parallel with TASK-003, TASK-004, TASK-006 once TASK-001 complete
- listForReview doesn't need to verify admin role - that's for TASK-006 (approve/reject)

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
