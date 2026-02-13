export function QuoteSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="pl-8 border-l-4 border-gray-100">
        <div className="skeleton h-6 w-full rounded mb-2"></div>
        <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
        <div className="skeleton h-6 w-1/2 rounded"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-4 w-1/4 rounded"></div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
