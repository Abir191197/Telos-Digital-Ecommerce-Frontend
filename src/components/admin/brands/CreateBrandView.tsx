"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/stores";
import type { Brand } from "@/types/ecommerce.types";
import {
  BrandLogoUploadCard,
  BrandPropertiesFormCard,
  BrandLivePreviewCard,
  type BrandFormValues,
} from "./";

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const PRESET_COLORS = [
  "#000000",
  "#1428A0",
  "#4285F4",
  "#E11D48",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#0284C7",
];

const PRESET_TAGS = [
  "Official Flagship",
  "Authorized Hub",
  "Certified Partner",
  "Premium Partner",
  "Direct Distributor",
];

export function CreateBrandView() {
  const router = useRouter();
  const { addBrand } = useAdminStore();

  // Form State
  const [formValues, setFormValues] = useState<BrandFormValues>({
    name: "",
    slug: "",
    tag: PRESET_TAGS[0],
    customTag: "",
    featured: true,
    description: "",
  });

  // Logo / Asset State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleFieldChange = <K extends keyof BrandFormValues>(
    key: K,
    value: BrandFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (val: string) => {
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormValues((prev) => ({
      ...prev,
      name: val,
      slug: generated,
    }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLogoError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setLogoError(
        `File "${file.name}" (${sizeMb}MB) exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload an optimized image.`
      );
      return;
    }

    const preview = URL.createObjectURL(file);
    setLogoUrl(preview);
    e.target.value = "";
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim()) return;

    setIsSubmitting(true);

    const effectiveSlug =
      formValues.slug.trim() ||
      formValues.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

    const finalTag = formValues.customTag.trim() || formValues.tag;

    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: formValues.name.trim(),
      slug: effectiveSlug,
      tag: finalTag,
      icon: formValues.name.trim(),
      featured: formValues.featured,
      description: formValues.description.trim() || undefined,
      logo: logoUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    addBrand(newBrand);
    setSuccessToast(true);

    setTimeout(() => {
      router.push("/dashboard/brands");
    }, 900);
  };

  return (
    <div className="w-full space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/brands"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shadow-2xs"
            title="Back to Brands"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Brand Catalog
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">New Partnership</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              Create Brand
            </h1>
          </div>
        </div>
      </div>

      {/* Success Toast Alert */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <div className="text-xs font-medium">
            <strong className="font-bold">Brand Created!</strong> &ldquo;{formValues.name}&rdquo; registered to catalog. Redirecting...
          </div>
        </div>
      )}

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form + Upload (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <BrandLogoUploadCard
              logoUrl={logoUrl}
              logoError={logoError}
              maxFileSizeMb={MAX_FILE_SIZE_MB}
              onLogoSelect={handleLogoSelect}
              onRemoveLogo={handleRemoveLogo}
            />

            <BrandPropertiesFormCard
              values={formValues}
              presetTags={PRESET_TAGS}
              isSubmitting={isSubmitting}
              onFieldChange={handleFieldChange}
              onNameChange={handleNameChange}
              onSubmit={handleSubmit}
            />
          </form>
        </div>

        {/* RIGHT COLUMN: Live Card Preview (4 cols sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <BrandLivePreviewCard
            name={formValues.name}
            slug={formValues.slug}
            tag={formValues.customTag.trim() || formValues.tag}
            featured={formValues.featured}
            description={formValues.description}
            logoUrl={logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
