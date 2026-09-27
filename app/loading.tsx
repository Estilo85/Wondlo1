export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9FE]">
      <div className="flex flex-col items-center gap-3">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C7B5F5] border-t-[#7E6BB3]" />
        <span className="text-xs font-medium text-[#6B7280]">Loading...</span>
      </div>
    </div>
  );
}
