export type AIModelType = "RECOMMENDATION" | "CHATBOT" | "DEMAND_FORECAST" | "PRODUCT_CLASSIFICATION" | "USER_BEHAVIOR_ANALYSIS";
export type AIModelStatus = "ACTIVE" | "INACTIVE" | "TRAINING" | "ERROR";

export type AIModel = {
  id: string;
  name: string;
  type: AIModelType;
  provider: string;
  endpoint?: string;
  status: AIModelStatus;
  description?: string;
  createdAt?: string;
};
