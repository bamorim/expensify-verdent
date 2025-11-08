export default function CategoriesPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          disabled
          className="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500"
          aria-label="Create category (coming soon)"
        >
          Create Category
        </button>
      </div>

      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No categories yet
        </h3>
        <p className="mb-4 text-gray-600">
          Categories help organize expenses by type (travel, meals, equipment, etc.).
        </p>
        <p className="text-sm text-gray-500">
          Category management coming soon.
        </p>
      </div>
    </div>
  );
}
