export default function ReviewsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
      </div>

      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No pending reviews
        </h3>
        <p className="mb-4 text-gray-600">
          Review and approve or reject expense reimbursement requests.
        </p>
        <p className="text-sm text-gray-500">
          Review workflow coming soon.
        </p>
      </div>
    </div>
  );
}
