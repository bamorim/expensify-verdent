"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

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

export default function ExpensesPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ExpenseStatus
  >("ALL");

  const { data: expenses, isLoading } = api.expense.list.useQuery({
    organizationId: orgId,
  });

  const filteredExpenses =
    statusFilter === "ALL"
      ? expenses
      : expenses?.filter((e) => e.status === statusFilter);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <Link
          href={`/orgs/${orgId}/expenses/new`}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Submit Expense
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["ALL", "SUBMITTED", "APPROVED", "REJECTED"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      ) : !filteredExpenses || filteredExpenses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {statusFilter === "ALL"
              ? "No expenses yet"
              : `No ${statusFilter.toLowerCase()} expenses`}
          </h3>
          <p className="mb-4 text-gray-600">
            {statusFilter === "ALL"
              ? "Submit your first expense reimbursement request."
              : `No expenses with status: ${statusFilter.toLowerCase()}`}
          </p>
          {statusFilter === "ALL" && (
            <Link
              href={`/orgs/${orgId}/expenses/new`}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Submit Expense
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {expense.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">
                        {expense.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${(expense.amount / 100).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={expense.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/orgs/${orgId}/expenses/${expense.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
