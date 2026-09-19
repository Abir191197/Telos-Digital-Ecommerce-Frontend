import type { Metadata } from "next";
import { TransactionReportView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Payment Transactions Audit | Admin Portal",
  description: "Financial ledger of customer payments, transaction IDs, MFS numbers, and verified volume.",
};

export default function TrasntionReportPage() {
  return <TransactionReportView />;
}
