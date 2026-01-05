// components/SkeletonRow.jsx
export default function SkeletonRow() {
  return (
    <div className="animate-pulse flex gap-4 p-2">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/6"></div>
    </div>
  );
}
