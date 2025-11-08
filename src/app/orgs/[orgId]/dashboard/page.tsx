export default function DashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-sm text-gray-500">No expenses yet</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Pending Reviews
          </h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-sm text-gray-500">All caught up</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Active Policies
          </h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-sm text-gray-500">No policies configured</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Categories
          </h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-sm text-gray-500">No categories created</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Welcome to your organization
        </h2>
        <p className="text-gray-600">
          Start by creating categories and policies to manage expenses.
        </p>
      </div>
    </div>
  );
}
