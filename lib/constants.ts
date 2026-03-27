export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const AUTH_COOKIE = "planner_admin_token";
export const ORDER_STATUS_OPTIONS = [
  { value: "NEW", label: "new" },
  { value: "PROCESSING", label: "processing" },
  { value: "CONFIRMED", label: "confirmed" },
  { value: "PICKING", label: "picking" },
  { value: "SHIPPED", label: "shipped" },
  { value: "COMPLETED", label: "completed" },
  { value: "CANCELLED", label: "cancelled" }
] as const;
export const PRODUCT_TYPE_OPTIONS = [
  { value: "REBAR", label: "арматура" },
  { value: "PROFILE", label: "профиль" }
] as const;
