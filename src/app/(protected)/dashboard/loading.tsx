import { PageLoader } from "@/components/common";

export default function DashboardLoading() {
  return (
    <PageLoader
      title="Loading Workspace..."
      description="Synchronizing admin controls, catalog state, and telemetry."
      badgeText="Admin Workspace"
    />
  );
}
