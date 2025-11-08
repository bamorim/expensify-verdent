import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  approve: protectedProcedure
    .input(z.object({
      expenseId: z.string(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const expense = await ctx.db.expense.findUnique({
        where: { id: input.expenseId },
        include: {
          organization: true,
        },
      });

      if (!expense) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found",
        });
      }

      const membership = await ctx.db.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: expense.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership || membership.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can approve expenses",
        });
      }

      if (expense.status !== "SUBMITTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only submitted expenses can be approved",
        });
      }

      const updatedExpense = await ctx.db.$transaction(async (tx) => {
        const updated = await tx.expense.update({
          where: { id: input.expenseId },
          data: {
            status: "APPROVED",
          },
          include: {
            user: true,
            category: true,
          },
        });

        await tx.expenseReview.create({
          data: {
            expenseId: input.expenseId,
            reviewerId: ctx.session.user.id,
            status: "APPROVED",
            comment: input.comment,
          },
        });

        return updated;
      });

      return updatedExpense;
    }),

  reject: protectedProcedure
    .input(z.object({
      expenseId: z.string(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const expense = await ctx.db.expense.findUnique({
        where: { id: input.expenseId },
        include: {
          organization: true,
        },
      });

      if (!expense) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found",
        });
      }

      const membership = await ctx.db.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: expense.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership || membership.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reject expenses",
        });
      }

      if (expense.status !== "SUBMITTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only submitted expenses can be rejected",
        });
      }

      const updatedExpense = await ctx.db.$transaction(async (tx) => {
        const updated = await tx.expense.update({
          where: { id: input.expenseId },
          data: {
            status: "REJECTED",
          },
          include: {
            user: true,
            category: true,
          },
        });

        await tx.expenseReview.create({
          data: {
            expenseId: input.expenseId,
            reviewerId: ctx.session.user.id,
            status: "REJECTED",
            comment: input.comment,
          },
        });

        return updated;
      });

      return updatedExpense;
    }),

  listPending: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await ctx.db.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership || membership.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can list pending expenses",
        });
      }

      const expenses = await ctx.db.expense.findMany({
        where: {
          organizationId: input.organizationId,
          status: "SUBMITTED",
        },
        include: {
          user: true,
          category: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return expenses;
    }),
});
