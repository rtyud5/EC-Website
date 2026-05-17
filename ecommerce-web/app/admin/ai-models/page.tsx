"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import type { AIModel } from "@/types/ai.type";

const TYPE_LABELS: Record<string, string> = {
  RECOMMENDATION: "Gợi ý sản phẩm",
  CHATBOT: "Chatbot tư vấn",
  DEMAND_FORECAST: "Dự đoán nhu cầu",
  PRODUCT_CLASSIFICATION: "Phân loại sản phẩm",
  USER_BEHAVIOR_ANALYSIS: "Phân tích hành vi",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-500",
  TRAINING: "bg-yellow-100 text-yellow-700",
  ERROR: "bg-red-100 text-red-700",
};

export default function AdminAIModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ai-models")
      .then((res) => setModels(res.data.data || []))
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Models</h1>
          <p className="text-sm text-gray-500">Quản lý các model AI/ML cho hệ thống</p>
        </div>
        <Button size="sm">+ Thêm model</Button>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
        💡 Module AI Models là placeholder để sau này tích hợp các chức năng AI như gợi ý sản phẩm, chatbot tư vấn, dự đoán doanh thu, phân loại sản phẩm và phân tích hành vi người dùng.
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-lg bg-gray-200" />)}
        </div>
      ) : models.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có AI model nào" icon="🤖" /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {models.map((model) => (
            <div key={model.id} className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{model.name}</h3>
                  <span className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                    {TYPE_LABELS[model.type] || model.type}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[model.status] || "bg-gray-100 text-gray-500"}`}>
                  {model.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{model.description || "Không có mô tả"}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>Provider: {model.provider}</span>
                {model.endpoint && <span>Endpoint: {model.endpoint}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Types Reference */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Các loại model hỗ trợ</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-sm font-medium text-gray-800">{label}</div>
              <div className="mt-0.5 font-mono text-xs text-gray-400">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
