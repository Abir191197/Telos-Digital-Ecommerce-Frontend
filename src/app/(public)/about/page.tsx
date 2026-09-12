import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About Us | Telos Cart Bangladesh - Next-Gen Tech Commerce",
  description:
    "Learn about Telos Cart, Bangladesh's next-generation authentic digital & tech commerce platform with 100% verified distributor warranty.",
};

export default function AboutPage() {
  return <AboutView />;
}
