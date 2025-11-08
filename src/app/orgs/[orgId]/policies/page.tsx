"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function PoliciesPage() {
  const params = useParams<{ orgId: string }>();
  const router = useRouter();
  const orgId = params.orgId;

  const { data: policies, isLoading } = api.policy.list.useQuery({
    organizationId: orgId,
  });

  const { data: categories } = api.category.list.useQuery({
    organizationId: orgId,
  });

  const { data: members } = api.organization.listMembers.useQuery({
    organizationId: orgId,
  });

  const { data: organization } = api.organization.getById.useQuery(
    { id: orgId },
    { enabled: !!orgId }
  );

  const currentMembership = organization?.currentUserMembership;

  const deletePolicyMutation = api.policy.delete.useMutation({
    onSuccess: () => {
      void utils.policy.list.invalidate();
      setDeleteConfirm(null);
    },
  });

  const utils = api.useUtils();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterScope, setFilterScope] = useState<"all" | "org" | "user">("all");
  const [sortBy, setSortBy] = useState<"category" | "amount">("category");

  const isAdmin = currentMembership?.role === "ADMIN";

  const filteredPolicies = policies?.filter((policy) => {
    if (filterScope === "org") return !policy.userId;
    if (filterScope === "user") return !!policy.userId;
    return true;
  });

  const sortedPolicies = filteredPolicies?.sort((a, b) => {
    if (sortBy === "category") {
      const catA = categories?.find((c) => c.id === a.categoryId)?.name ?? "";
      const catB = categories?.find((c) => c.id === b.categoryId)?.name ?? "";
      return catA.localeCompare(catB);
    }
    return b.maxAmount - a.maxAmount;
  });

  const handleDelete = (policyId: string) => {
    deletePolicyMutation.mutate({ id: policyId });
  };

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c.id === categoryId)?.name ?? "Unknown";
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "Organization-wide";
    const member = members?.find((m) => m.userId === userId);
    return member?.user.name ?? member?.user.email ?? "Unknown User";
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
        <div className="flex gap-2">
          <Link
            href={`/orgs/${orgId}/policies/debug`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Debug Policies
          </Link>
          {isAdmin && (
            <Link
              href={`/orgs/${orgId}/policies/new`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Policy
            </Link>
          )}
        </div>
      </div>

      {sortedPolicies && sortedPolicies.length > 0 ? (
        <>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterScope("all")}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  filterScope === "all"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterScope("org")}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  filterScope === "org"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Organization
              </button>
              <button
                onClick={() => setFilterScope("user")}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  filterScope === "user"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                User-specific
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "category" | "amount")}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="category">Category</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Scope
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Max Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Auto-approve
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {getUserName(policy.userId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {getCategoryName(policy.categoryId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatAmount(policy.maxAmount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {policy.period}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {policy.autoApprove ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          No
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link
                          href={`/orgs/${orgId}/policies/${policy.id}`}
                          className="mr-4 text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(policy.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No policies yet
          </h3>
          <p className="mb-4 text-gray-600">
            Policies define spending limits and approval rules for expense categories.
          </p>
          {isAdmin && (
            <Link
              href={`/orgs/${orgId}/policies/new`}
              className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Your First Policy
            </Link>
          )}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Delete Policy
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this policy? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={deletePolicyMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={deletePolicyMutation.isPending}
              >
                {deletePolicyMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
