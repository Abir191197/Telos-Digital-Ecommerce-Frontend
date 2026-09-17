import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function ProfileRedirectPage() {
  redirect(ROUTES.ACCOUNT);
}

