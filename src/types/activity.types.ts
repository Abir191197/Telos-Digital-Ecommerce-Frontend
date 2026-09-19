export type ActivitySeverity = "info" | "success" | "warning" | "danger";

export type ActivityCategory =
  | "auth"
  | "catalog"
  | "orders"
  | "payments"
  | "security"
  | "settings";

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO 8601
  actor: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  action: string;
  entity: string;
  entityId?: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  details: string;
  ipAddress: string;
  device: string;
  location: string;
}
