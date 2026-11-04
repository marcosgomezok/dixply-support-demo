export type Locale = "en" | "es";

export type ScenarioId =
  | "general"
  | "products"
  | "orders"
  | "technical"
  | "invoice"
  | "human";

export type GeneralTopic = "hours" | "services" | "contact" | "company";

export type ProductCategory = "home" | "everyday";

export type ProductId =
  | "luma-lamp"
  | "arc-light"
  | "field-tote"
  | "transit-bottle";

export type OrderId = "ORD-1042" | "ORD-2086" | "ORD-3195";

export type TechnicalCategory =
  | "account"
  | "checkout"
  | "delivery"
  | "product";

export type InvoiceData = {
  product: ProductId;
  quantity: number;
  customerName: string;
  customerEmail: string;
};

export type WorkflowStage =
  | "incoming"
  | "intent"
  | "routing"
  | "response"
  | "customerData"
  | "invoice"
  | "handoff";
