export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="h-48 bg-surface-container rounded-2xl animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-surface-container rounded-2xl animate-pulse"></div>
        <div className="h-32 bg-surface-container rounded-2xl animate-pulse"></div>
        <div className="h-32 bg-surface-container rounded-2xl animate-pulse"></div>
      </div>
      <div className="h-64 bg-surface-container rounded-2xl animate-pulse"></div>
    </div>
  );
}
