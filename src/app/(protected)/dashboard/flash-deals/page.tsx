import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function AdminFlashDealsAliasPage() {
  redirect(ROUTES.ADMIN_FLASH_DEALS);
}
