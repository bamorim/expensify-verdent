"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function NewExpensePage() {
  const params = useParams<{ orgId: string }>();
  const router = useRouter();
  const orgId = params.orgId;

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: categories } = api.category.list.useQuery({
    organizationId: orgId,
  });

  const { data: policies } = api.policy.list.useQuery({
    organizationId: orgId,
  });

  const utils = api.useUtils();

  const submitExpenseMutation = api.expense.submit.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      utils.expense.list.invalidate();
      setTimeout(() => {
        router.push(`/orgs/${orgId}/expenses`);
      }, 2000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const applicablePolicy = categoryId
    ? policies?.find((p) => p.categoryId === categoryId && p.userId === null) ??
      null
    : null;

  const amountValue = parseFloat(amount) || 0;
  const exceedsLimit =
    applicablePolicy && amountValue > applicablePolicy.maxAmount / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      setError("Date cannot be in the future");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description");
      return;
    }

    if (description.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }

    submitExpenseMutation.mutate({
      organizationId: orgId,
      categoryId,
      amount: Math.round(parseFloat(amount) * 100),
      date: new Date(date),
      description: description.trim(),
    });
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/orgs/${orgId}/expenses`}
          className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Expenses
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Submit Expense</h1>
        <p className="mt-2 text-sm text-gray-600">
          Submit a new expense for reimbursement
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div
              className={`mb-6 rounded-md p-4 ${
                successMessage.includes("auto-approved")
                  ? "bg-green-50"
                  : successMessage.includes("auto-rejected")
                    ? "bg-red-50"
                    : "bg-blue-50"
              }`}
            >
              <p
                className={`text-sm ${
                  successMessage.includes("auto-approved")
                    ? "text-green-800"
                    : successMessage.includes("auto-rejected")
                      ? "text-red-800"
                      : "text-blue-800"
                }`}
              >
                {successMessage.includes("auto-approved") && "✓ "}
                {successMessage.includes("auto-rejected") && "✗ "}
                {successMessage}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Category
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setError("");
              }}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitExpenseMutation.isPending}
              required
              aria-required="true"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {categoryId && applicablePolicy && (
            <div className="mb-6 rounded-md bg-blue-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-blue-900">
                Policy Information
              </h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <strong>Max Amount:</strong> $
                  {(applicablePolicy.maxAmount / 100).toFixed(2)} per{" "}
                  {applicablePolicy.period.toLowerCase()}
                </p>
                <p>
                  <strong>Review:</strong>{" "}
                  {applicablePolicy.autoApprove
                    ? "Auto-approved (if within limit)"
                    : "Manual review required"}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Amount (USD)
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                min="0.01"
                step="0.01"
                className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-4 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                disabled={submitExpenseMutation.isPending}
                required
                aria-required="true"
              />
            </div>
            {exceedsLimit && (
              <p className="mt-2 text-sm text-yellow-700">
                ⚠ Amount exceeds policy limit. This expense may be
                auto-rejected.
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Date
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitExpenseMutation.isPending}
              required
              aria-required="true"
            />
            <p className="mt-1 text-xs text-gray-500">
              Date of the expense (cannot be in the future)
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief description of the expense..."
              disabled={submitExpenseMutation.isPending}
              maxLength={500}
              required
              aria-required="true"
            />
            <p className="mt-1 text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitExpenseMutation.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitExpenseMutation.isPending
                ? "Submitting..."
                : "Submit Expense"}
            </button>
            <Link
              href={`/orgs/${orgId}/expenses`}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
