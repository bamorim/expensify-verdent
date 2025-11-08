# Task: Invitation Management Router

## Meta Information

- **Task ID**: `TASK-013`
- **Title**: Invitation Management Router
- **Status**: `Not Started`
- **Priority**: `P1`
- **Created**: 2025-11-08
- **Updated**: 2025-11-08
- **Estimated Effort**: 1.5 days
- **Actual Effort**: -

## Related Documents

- **PRD**: `/docs/product/prd-main.md` (FR1: User Management)
- **Dependencies**: TASK-001 (Database Schema)
- **Architecture**: `/docs/technical/architecture.md`

## Description

Implement the invitation management system allowing org admins to invite users via email and users to accept invitations and join organizations. Includes database schema for invitations, tRPC router for invitation operations, and email sending integration.

## Acceptance Criteria

- [ ] Invitation table created in database schema
- [ ] Invitation router created with all required procedures
- [ ] Admins can create invitations with email address
- [ ] Users can accept invitations with valid token
- [ ] Invitations can be listed and revoked by admins
- [ ] Email sent when invitation created (integration with email service)
- [ ] Invitation tokens are secure and expire after 7 days
- [ ] All procedures require proper authorization
- [ ] All inputs validated with Zod schemas
- [ ] All operations tested with transactional testing
- [ ] No TypeScript errors

## TODOs

### Database Schema
- [ ] Add `Invitation` model to `prisma/schema.prisma`:
  - [ ] id: String (cuid)
  - [ ] email: String (email being invited)
  - [ ] token: String (unique, secure token for acceptance)
  - [ ] organizationId: String (FK to Organization)
  - [ ] invitedById: String (FK to User - who sent the invite)
  - [ ] status: Enum (PENDING, ACCEPTED, REVOKED, EXPIRED)
  - [ ] expiresAt: DateTime (7 days from creation)
  - [ ] createdAt: DateTime
  - [ ] acceptedAt: DateTime (nullable)
  - [ ] acceptedById: String (nullable, FK to User who accepted)
- [ ] Add indexes:
  - [ ] Unique index on token
  - [ ] Index on organizationId
  - [ ] Index on email
- [ ] Add relations:
  - [ ] organization: Organization
  - [ ] invitedBy: User
  - [ ] acceptedBy: User (nullable)
- [ ] Create migration: `pnpm prisma migrate dev --name add-invitations`
- [ ] Update `prisma generate`

### Router Implementation
- [ ] Create `src/server/api/routers/invitation.ts`
- [ ] Import: createTRPCRouter, protectedProcedure, TRPCError
- [ ] Import: z for Zod schemas
- [ ] Create input schemas:
  - [ ] createInput: { orgId: string, email: string }
  - [ ] listInput: { orgId: string, status?: InvitationStatus }
  - [ ] revokeInput: { id: string }
  - [ ] acceptInput: { token: string }
  - [ ] getByTokenInput: { token: string } (for previewing invitation)
- [ ] Implement `create` procedure:
  - Input: orgId, email
  - Check: User is admin of organization
  - Validate: Email format valid
  - Check: User with email not already in org
  - Check: No pending invitation for this email in org
  - Generate: Secure random token (use crypto.randomBytes)
  - Set: expiresAt = now + 7 days
  - Create: Invitation record
  - Send: Email with invitation link
  - Return: Created invitation (without token)
- [ ] Implement `list` procedure:
  - Input: orgId, optional status filter
  - Check: User is member of organization
  - Return: All invitations for org (ordered by createdAt desc)
  - Filter: By status if provided
  - Don't expose: Token in response
- [ ] Implement `revoke` procedure:
  - Input: id
  - Check: User is admin of org owning invitation
  - Check: Invitation is PENDING
  - Update: Set status to REVOKED
  - Return: Updated invitation
- [ ] Implement `accept` procedure:
  - Input: token
  - Find: Invitation by token
  - Check: Status is PENDING
  - Check: Not expired (expiresAt > now)
  - Check: Current user's email matches invitation email
  - Create: Organization membership (role: MEMBER)
  - Update: Invitation status to ACCEPTED, acceptedAt, acceptedById
  - Return: Organization details
- [ ] Implement `getByToken` procedure (public/protected):
  - Input: token
  - Find: Invitation by token
  - Check: Status is PENDING and not expired
  - Return: Organization name, inviter name (for preview)
  - Don't expose: Sensitive details

### Email Integration
- [ ] Create email template for invitation
- [ ] Template includes:
  - [ ] Organization name
  - [ ] Inviter name
  - [ ] Acceptance link with token
  - [ ] Expiration notice (7 days)
- [ ] Use email service from environment config
- [ ] Handle email sending errors gracefully

### Authorization Helpers
- [ ] Reuse or create helper to check if user is admin of org
- [ ] Helper to validate invitation token security

### Integration with Root Router
- [ ] Register invitationRouter in `src/server/api/root.ts`

### Testing
- [ ] Create `src/server/api/routers/invitation.test.ts`
- [ ] Import shared vitest setup
- [ ] Test helpers:
  - [ ] Factory: createTestInvitation
- [ ] Test create procedure:
  - [ ] Creates invitation successfully
  - [ ] Sends email (mock email service)
  - [ ] Fails if user not admin
  - [ ] Fails if email already in org
  - [ ] Fails if pending invitation exists
  - [ ] Generates secure token
  - [ ] Sets correct expiration (7 days)
- [ ] Test list procedure:
  - [ ] Returns all invitations for org
  - [ ] Filters by status correctly
  - [ ] Non-members cannot list
  - [ ] Doesn't expose tokens
- [ ] Test revoke procedure:
  - [ ] Revokes invitation successfully
  - [ ] Fails if user not admin
  - [ ] Fails if invitation not PENDING
  - [ ] Fails if invitation doesn't exist
- [ ] Test accept procedure:
  - [ ] Accepts invitation successfully
  - [ ] Creates membership with MEMBER role
  - [ ] Updates invitation status
  - [ ] Fails if token invalid
  - [ ] Fails if expired
  - [ ] Fails if already accepted/revoked
  - [ ] Fails if user email doesn't match
- [ ] Test getByToken procedure:
  - [ ] Returns org details for valid token
  - [ ] Fails if token invalid/expired/revoked
  - [ ] Doesn't expose sensitive data
- [ ] All tests use transactional DB

## Progress Updates

### 2025-11-08 - Initial
**Status**: Not Started
**Progress**: Task created and planning phase complete
**Blockers**: Requires TASK-001 completion
**Next Steps**: Begin implementation after TASK-001

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Email sending functional
- [ ] Token security verified
- [ ] Authorization checks comprehensive
- [ ] Error messages helpful
- [ ] Code review completed
- [ ] Ready for TASK-014 (Invitation UI)

## Notes

- Token should be cryptographically secure (not guessable)
- Consider rate limiting on invitation creation to prevent abuse
- Email matching should be case-insensitive
- If user with email already exists, they accept with that account
- If user doesn't exist, they'll need to sign up first then accept
- Consider adding invitation reminder functionality (future)
- May want to track invitation acceptance rate for metrics

---

**Template Version**: 1.0
**Last Updated**: 2025-11-08
