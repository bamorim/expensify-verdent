"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function PolicyDebugPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { data: categories } = api.category.list.useQuery({
    organizationId: orgId,
  });

  const { data: members } = api.organization.listMembers.useQuery({
    organizationId: orgId,
  });

  const { data: debugResult, refetch } = api.policy.debugPolicy.useQuery(
    {
      organizationId: orgId,
      userId: selectedUserId,
      categoryId: selectedCategoryId,
    },
    {
      enabled: false,
    }
  );

  const handleDebug = () => {
    if (selectedUserId && selectedCategoryId) {
      void refetch();
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/orgs/${orgId}/policies`}
          className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Policies
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Policy Debugger</h1>
        <p className="mt-2 text-gray-600">
          Test which policy applies to a specific user and category combination
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Select Parameters
          </h2>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="user"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                User
              </label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a user</option>
                {members?.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user.name ?? member.user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleDebug}
            disabled={!selectedUserId || !selectedCategoryId}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Resolve Policy
          </button>
        </div>

        {debugResult && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Resolution Result
              </h2>

              <div className="mb-4 rounded-md bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  {debugResult.reason}
                </p>
              </div>

              {debugResult.userSpecificPolicy && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      User-specific Policy
                    </h3>
                    {debugResult.selectedPolicy?.id ===
                      debugResult.userSpecificPolicy.id && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Category
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {categories?.find(
                            (c) => c.id === debugResult.userSpecificPolicy?.categoryId
                          )?.name ?? "Unknown"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Max Amount
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {formatAmount(debugResult.userSpecificPolicy.maxAmount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Period
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {debugResult.userSpecificPolicy.period}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Auto-approve
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {debugResult.userSpecificPolicy.autoApprove ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {debugResult.organizationPolicy && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Organization Policy
                    </h3>
                    {debugResult.selectedPolicy?.id ===
                      debugResult.organizationPolicy.id && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        ✓ Selected
                      </span>
                    )}
                    {debugResult.userSpecificPolicy &&
                      debugResult.selectedPolicy?.id !==
                        debugResult.organizationPolicy.id && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                        Overridden
                      </span>
                    )}
                  </div>
                  <div
                    className={`rounded-lg border-2 p-4 ${
                      debugResult.selectedPolicy?.id ===
                      debugResult.organizationPolicy.id
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Category
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {categories?.find(
                            (c) => c.id === debugResult.organizationPolicy?.categoryId
                          )?.name ?? "Unknown"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Max Amount
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {formatAmount(debugResult.organizationPolicy.maxAmount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Period
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {debugResult.organizationPolicy.period}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Auto-approve
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {debugResult.organizationPolicy.autoApprove ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {!debugResult.selectedPolicy && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        No Policy Found
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        No policy applies to this user and category combination.
                        Consider creating one in the{" "}
                        <Link
                          href={`/orgs/${orgId}/policies`}
                          className="font-medium underline"
                        >
                          Policies page
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
