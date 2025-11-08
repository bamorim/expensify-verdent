export default function ExpensesPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <button
          disabled
          className="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500"
          aria-label="Submit expense (coming soon)"
        >
          Submit Expense
        </button>
      </div>

      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No expenses yet
        </h3>
        <p className="mb-4 text-gray-600">
          Submit expense reimbursement requests for business expenses.
        </p>
        <p className="text-sm text-gray-500">
          Expense submission coming soon.
        </p>
      </div>
    </div>
  );
}
