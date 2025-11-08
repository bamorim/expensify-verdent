"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

type ExpenseStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const config = {
    SUBMITTED: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Awaiting Review",
      icon: "⏳",
    },
    APPROVED: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Approved",
      icon: "✓",
    },
    REJECTED: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Rejected",
      icon: "✗",
    },
  };

  const { bg, text, label, icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${bg} px-3 py-1 text-xs font-semibold ${text}`}
      aria-label={`Status: ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

export default function ExpenseDetailPage() {
  const params = useParams<{ orgId: string; id: string }>();
  const router = useRouter();
  const { orgId, id } = params;

  const { data: expense, isLoading, error } = api.expense.getById.useQuery({
    id,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-96 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-900">
              Expense Not Found
            </h2>
            <p className="mb-4 text-red-700">
              {error?.message || "The expense you're looking for doesn't exist."}
            </p>
            <Link
              href={`/orgs/${orgId}/expenses`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Expenses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href={`/orgs/${orgId}/expenses`}
            className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Expenses
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Expense Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Submitted on{" "}
                {new Date(expense.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={expense.status} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Expense Information
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {expense.category.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  ${(expense.amount / 100).toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Expense Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(expense.date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Submitted By
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {expense.user.name ?? expense.user.email}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {expense.description}
                </dd>
              </div>
            </dl>
          </div>

          {expense.reviews && expense.reviews.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Audit Trail
              </h2>
              <div className="space-y-4">
                {expense.reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`flex gap-4 ${
                      index !== expense.reviews.length - 1
                        ? "border-b border-gray-200 pb-4"
                        : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          review.status === "APPROVED"
                            ? "bg-green-100"
                            : review.status === "REJECTED"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        <span className="text-sm">
                          {review.status === "APPROVED"
                            ? "✓"
                            : review.status === "REJECTED"
                              ? "✗"
                              : "⏳"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {review.status === "SUBMITTED"
                            ? "Submitted"
                            : review.status === "APPROVED"
                              ? "Approved"
                              : "Rejected"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {review.reviewer && (
                        <p className="mt-1 text-sm text-gray-600">
                          by {review.reviewer.name ?? review.reviewer.email}
                        </p>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-sm text-gray-700">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
