"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function OrganizationsPage() {
  const { data: organizations, isLoading } = api.organization.list.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Organizations</h1>
        <Link
          href="/app/organizations/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Create New Organization
        </Link>
      </div>

      {!organizations || organizations.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No organizations yet
          </h3>
          <p className="mb-4 text-gray-600">
            Get started by creating your first organization.
          </p>
          <Link
            href="/app/organizations/new"
            className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Create Organization
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/orgs/${org.id}/dashboard`}
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {org.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {org.memberships[0]?.role === "ADMIN" ? "Admin" : "Member"}
                </span>
                <span>•</span>
                <span>{org.memberships.length} member(s)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
