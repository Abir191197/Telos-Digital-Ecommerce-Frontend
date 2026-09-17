import { PageLoader } from "@/components/common";

export default function DashboardCategoriesLoading() {
  return (
    <PageLoader
      title="Loading Categories..."
      description="Preparing catalog aisles, subcategories, and hierarchy settings."
      badgeText="Admin Portal"
    />
  );
}
