"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

export default function EditPolicyPage() {
  const params = useParams<{ orgId: string; id: string }>();
  const router = useRouter();
  const orgId = params.orgId;
  const policyId = params.id;

  const [maxAmount, setMaxAmount] = useState("");
  const [period, setPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [autoApprove, setAutoApprove] = useState(false);
  const [error, setError] = useState("");

  const { data: policy, isLoading } = api.policy.getById.useQuery({
    id: policyId,
  });

  const { data: category } = api.category.list.useQuery(
    { organizationId: orgId },
    {
      enabled: !!policy,
      select: (categories) =>
        categories.find((c) => c.id === policy?.categoryId),
    }
  );

  const { data: user } = api.organization.listMembers.useQuery(
    { organizationId: orgId },
    {
      enabled: !!policy?.userId,
      select: (members) =>
        members.find((m) => m.userId === policy?.userId)?.user,
    }
  );

  useEffect(() => {
    if (policy) {
      setMaxAmount((policy.maxAmount / 100).toFixed(2));
      setPeriod(policy.period);
      setAutoApprove(policy.autoApprove);
    }
  }, [policy]);

  const updatePolicyMutation = api.policy.update.useMutation({
    onSuccess: () => {
      router.push(`/orgs/${orgId}/policies`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!maxAmount || parseFloat(maxAmount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    const amountInCents = Math.round(parseFloat(maxAmount) * 100);

    updatePolicyMutation.mutate({
      id: policyId,
      maxAmount: amountInCents,
      period,
      autoApprove,
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Policy not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/orgs/${orgId}/policies`}
          className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Policies
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Policy</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              Policy Details (Cannot be changed)
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">Scope</dt>
                <dd className="text-sm text-gray-900">
                  {policy.userId ? (
                    <>
                      User-specific:{" "}
                      <span className="font-medium">
                        {user?.name ?? user?.email ?? "Unknown User"}
                      </span>
                    </>
                  ) : (
                    "Organization-wide"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">
                  {category?.name ?? "Unknown"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-gray-500">
              To change the scope or category, please create a new policy
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="maxAmount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Maximum Amount (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="maxAmount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="0.00"
                required
                aria-required="true"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Maximum amount allowed per period
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="period"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Period <span className="text-red-500">*</span>
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "MONTHLY" | "YEARLY")}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
              aria-required="true"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Time period for the spending limit
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="autoApprove" className="text-sm font-medium text-gray-700">
                  Auto-approve compliant expenses
                </label>
                <p className="text-xs text-gray-500">
                  {autoApprove
                    ? "Expenses within this policy's limits will be automatically approved"
                    : "Expenses within this policy's limits will require manual review"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={`/orgs/${orgId}/policies`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={updatePolicyMutation.isPending}
            >
              {updatePolicyMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
