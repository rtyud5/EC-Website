export function EmptyState({ message, icon }: { message: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
      <span className="mb-3 text-4xl">{icon || "📭"}</span>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
