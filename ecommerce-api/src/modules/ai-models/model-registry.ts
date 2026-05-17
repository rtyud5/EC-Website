/**
 * Model Registry - Danh sách các loại AI model hỗ trợ.
 * Mỗi loại model phục vụ một mục đích khác nhau trong hệ thống e-commerce.
 */
export const MODEL_TYPES = {
  RECOMMENDATION: {
    name: "Gợi ý sản phẩm",
    description: "Gợi ý sản phẩm dựa trên hành vi mua hàng và sở thích của user",
    examples: ["Collaborative Filtering", "Content-Based Filtering", "Hybrid"],
  },
  CHATBOT: {
    name: "Chatbot tư vấn",
    description: "Tư vấn sản phẩm, trả lời câu hỏi khách hàng tự động",
    examples: ["GPT-based", "Rule-based", "RAG"],
  },
  DEMAND_FORECAST: {
    name: "Dự đoán nhu cầu",
    description: "Dự đoán doanh thu, xu hướng bán hàng theo mùa, thời gian",
    examples: ["ARIMA", "Prophet", "LSTM"],
  },
  PRODUCT_CLASSIFICATION: {
    name: "Phân loại sản phẩm",
    description: "Tự động phân loại sản phẩm vào danh mục dựa trên hình ảnh/mô tả",
    examples: ["CNN Image Classification", "NLP Text Classification"],
  },
  USER_BEHAVIOR_ANALYSIS: {
    name: "Phân tích hành vi",
    description: "Phân tích hành vi duyệt web, mua hàng để tối ưu UX và marketing",
    examples: ["Clustering", "Segmentation", "Funnel Analysis"],
  },
} as const;

export type ModelType = keyof typeof MODEL_TYPES;

/** Danh sách model mẫu để seed */
export const DEFAULT_MODELS = [
  {
    name: "Product Recommendation Engine",
    type: "RECOMMENDATION" as const,
    provider: "internal",
    description: "Gợi ý sản phẩm dựa trên lịch sử mua hàng và collaborative filtering",
    status: "INACTIVE" as const,
  },
  {
    name: "Customer Support Chatbot",
    type: "CHATBOT" as const,
    provider: "openai",
    description: "Chatbot tư vấn khách hàng sử dụng GPT API",
    status: "INACTIVE" as const,
  },
  {
    name: "Sales Demand Forecaster",
    type: "DEMAND_FORECAST" as const,
    provider: "internal",
    description: "Dự đoán nhu cầu bán hàng theo mùa với Prophet/ARIMA",
    status: "INACTIVE" as const,
  },
  {
    name: "Auto Product Classifier",
    type: "PRODUCT_CLASSIFICATION" as const,
    provider: "huggingface",
    description: "Phân loại sản phẩm tự động dựa trên hình ảnh và mô tả",
    status: "INACTIVE" as const,
  },
  {
    name: "User Behavior Analyzer",
    type: "USER_BEHAVIOR_ANALYSIS" as const,
    provider: "internal",
    description: "Phân tích hành vi người dùng để tối ưu trải nghiệm mua hàng",
    status: "INACTIVE" as const,
  },
];
