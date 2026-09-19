import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function FlashRedirectPage() {
  redirect(ROUTES.FLASH_DEALS);
}
