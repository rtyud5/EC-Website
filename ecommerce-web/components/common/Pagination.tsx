interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Hiển thị tối đa 5 trang xung quanh trang hiện tại
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)
  );

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-orange-300 hover:text-orange-500 disabled:opacity-40"
      >
        ←
      </button>

      {/* Pages */}
      {visible.map((p, i) => {
        const showEllipsisBefore = i > 0 && p - visible[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsisBefore && (
              <span className="px-1 text-gray-300">...</span>
            )}
            <button
              onClick={() => onChange(p)}
              className={`min-w-[36px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                p === page
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-orange-300 hover:text-orange-500 disabled:opacity-40"
      >
        →
      </button>
    </div>
  );
}
