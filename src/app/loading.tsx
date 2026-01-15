export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-amber-800 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    </div>
  );
}
