# Task: Expense Categories Router

## Meta Information

- **Task ID**: `TASK-003`
- **Title**: Expense Categories Router
- **Status**: `Not Started`
- **Priority**: `P0`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 1 day
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR3: Expense Categories)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Implement the tRPC router for expense category CRUD operations. Categories are organization-scoped and represent the types of business expenses (e.g., meals, travel, office supplies). Admins can create and manage categories, while members can view them.

## Acceptance Criteria

- [ ] Category router created with all required procedures
- [ ] All procedures require user to be organization member
- [ ] Create/update/delete procedures require admin role
- [ ] All inputs validated with Zod schemas
- [ ] Category names are unique within organization
- [ ] All CRUD operations tested with transactional testing
- [ ] Proper error handling for authorization failures
- [ ] No TypeScript errors

## TODOs

### Router Implementation
- [ ] Create `src/server/api/routers/category.ts`
- [ ] Import: createTRPCRouter, protectedProcedure, TRPCError
- [ ] Import: z for Zod schemas
- [ ] Create input schemas:
  - [ ] createInput: { name: string, description?: string }
  - [ ] updateInput: { id: string, name: string, description?: string }
  - [ ] deleteInput: { id: string }
  - [ ] getByIdInput: { id: string }
  - [ ] listInput: { orgId: string }
- [ ] Implement `list` procedure
  - Input: orgId
  - Check: User is member of organization
  - Return: All categories for org, ordered by name
- [ ] Implement `getById` procedure
  - Input: id
  - Check: User is member of org owning category
  - Return: Category with id
- [ ] Implement `create` procedure
  - Input: orgId, name, description
  - Check: User is admin of organization
  - Check: Name is unique within org
  - Return: Created category
- [ ] Implement `update` procedure
  - Input: id, name, description
  - Check: User is admin of org owning category
  - Check: Name is unique within org (excluding current category)
  - Return: Updated category
- [ ] Implement `delete` procedure
  - Input: id
  - Check: User is admin of org owning category
  - Check: No active policies or expenses reference category (or handle deletion)
  - Return: Deleted category

### Authorization Helpers
- [ ] Create helper to check if user is member of org
- [ ] Create helper to check if user is admin of org
- [ ] Place helpers in `src/server/api/routers/category.ts` or shared auth file

### Integration with Root Router
- [ ] Register categoryRouter in `src/server/api/root.ts`

### Testing
- [ ] Create `src/server/api/routers/category.test.ts`
- [ ] Import shared vitest setup from TASK-001
- [ ] Test helpers:
  - [ ] Factory: createTestOrg, createTestUser, createTestMembership, createTestCategory
- [ ] Test list procedure:
  - [ ] Returns all categories for org
  - [ ] Filters by org (doesn't return other org's categories)
  - [ ] Non-members cannot list
- [ ] Test getById procedure:
  - [ ] Returns category by id
  - [ ] Fails if user not member of org
  - [ ] Fails if category doesn't exist
- [ ] Test create procedure:
  - [ ] Creates category successfully
  - [ ] Fails if user not admin
  - [ ] Fails if name already exists in org
  - [ ] Fails if org doesn't exist
- [ ] Test update procedure:
  - [ ] Updates category successfully
  - [ ] Fails if user not admin
  - [ ] Fails if name already exists in org (but same id is ok)
  - [ ] Fails if category doesn't exist
- [ ] Test delete procedure:
  - [ ] Deletes category successfully
  - [ ] Fails if user not admin
  - [ ] Fails if category doesn't exist
- [ ] All tests use transactional DB

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-001 completion
**Next Steps**: Begin router implementation after TASK-001

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Authorization checks comprehensive
- [ ] Error messages helpful
- [ ] Code review completed
- [ ] Ready for TASK-008 (Categories UI)

## Notes

- Categories are simple and may not have many operations, but foundation for policies
- Can be developed in parallel with TASK-004, TASK-005, TASK-006 once TASK-001 complete
- Test factories for orgs/users can be reused in other router tests
- Consider if category deletion should be soft-delete to maintain audit trail

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
