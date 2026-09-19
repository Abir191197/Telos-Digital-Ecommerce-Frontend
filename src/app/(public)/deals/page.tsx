import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function DealsRedirectPage() {
  redirect(ROUTES.FLASH_DEALS);
}
