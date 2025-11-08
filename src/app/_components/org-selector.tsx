"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";

export function OrgSelector() {
  const router = useRouter();
  const params = useParams();
  const currentOrgId = params.orgId as string;
  const [isOpen, setIsOpen] = useState(false);

  const { data: organizations } = api.organization.list.useQuery();
  const { data: currentOrg } = api.organization.getById.useQuery(
    { id: currentOrgId },
    { enabled: !!currentOrgId }
  );

  const handleOrgChange = (orgId: string) => {
    setIsOpen(false);
    router.push(`/orgs/${orgId}/dashboard`);
  };

  if (!currentOrg) {
    return (
      <div className="text-sm text-gray-600">Loading organization...</div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="truncate">{currentOrg.name}</span>
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Your Organizations
              </div>
              {organizations?.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgChange(org.id)}
                  className={`${
                    org.id === currentOrgId
                      ? "bg-indigo-50 text-indigo-900"
                      : "text-gray-900 hover:bg-gray-100"
                  } block w-full px-4 py-2 text-left text-sm`}
                >
                  {org.name}
                  {org.id === currentOrgId && (
                    <span className="ml-2 text-xs text-indigo-600">
                      (current)
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <Link
                  href="/app/organizations/new"
                  className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  + Create New Organization
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
