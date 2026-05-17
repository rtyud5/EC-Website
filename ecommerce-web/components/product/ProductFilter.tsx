"use client";

import { formatCurrency } from "@/lib/utils";

interface ProductFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PRICE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: "Dưới 100.000₫", range: [0, 100000] },
  { label: "100.000₫ - 300.000₫", range: [100000, 300000] },
  { label: "300.000₫ - 1.000.000₫", range: [300000, 1000000] },
  { label: "1.000.000₫ - 5.000.000₫", range: [1000000, 5000000] },
  { label: "Trên 5.000.000₫", range: [5000000, 50000000] },
];

export function ProductFilter({ priceRange, onPriceChange }: ProductFilterProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>

      {/* Price range */}
      <div className="mt-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Khoảng giá</p>
        <div className="space-y-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active =
              priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
            return (
              <button
                key={preset.label}
                onClick={() => onPriceChange(preset.range)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                  active
                    ? "bg-orange-50 font-medium text-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom range */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={priceRange[0] || ""}
            onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Đến"
            value={priceRange[1] || ""}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
          />
        </div>
        <button
          onClick={() => onPriceChange([0, 50000000])}
          className="mt-2 w-full rounded-lg border border-gray-200 py-1.5 text-xs text-gray-400 hover:text-gray-600"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
