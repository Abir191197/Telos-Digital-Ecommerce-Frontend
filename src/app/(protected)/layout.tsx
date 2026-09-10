import { AdminLayout } from "@/components/admin";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
