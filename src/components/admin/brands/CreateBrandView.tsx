"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  useGetBrandByIdQuery,
  useGetBrandBySlugQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/services/api/brands/brandApi";
import {
  ConfirmationModal,
  PageLoader,
  type ConfirmationDialogState,
} from "@/components/common";
import {
  BrandLogoUploadCard,
  BrandPropertiesFormCard,
  BrandLivePreviewCard,
  type BrandFormValues,
} from "./";

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const PRESET_TAGS = [
  "Official Flagship",
  "Authorized Hub",
  "Certified Partner",
  "Premium Partner",
  "Direct Distributor",
];

const EMPTY_FORM: BrandFormValues = {
  name: "",
  tagline: PRESET_TAGS[0],
  customTagline: "",
  isFeaturedMarquee: true,
  description: "",
};

export interface CreateBrandViewProps {
  brandId?: string;
  /** Slug-based lookup — uses the dedicated /brands/slug/:slug backend endpoint */
  brandSlug?: string;
}

export function CreateBrandView({ brandId, brandSlug }: CreateBrandViewProps = {}) {
  const router = useRouter();

  // Slug-based lookup (preferred — clean URLs)
  const { data: brandBySlug, isLoading: isLoadingBySlug } = useGetBrandBySlugQuery(
    brandSlug || "",
    { skip: !brandSlug }
  );
  // ID-based lookup (fallback / direct)
  const { data: brandById, isLoading: isLoadingById } = useGetBrandByIdQuery(
    brandId || "",
    { skip: !brandId }
  );

  const existingBrand = brandBySlug ?? brandById;
  const isLoading = isLoadingBySlug || isLoadingById;
  const resolvedId = existingBrand?.id ?? brandId;
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const isEditMode = Boolean(brandSlug || brandId) && Boolean(existingBrand);
  const isSubmitting = isCreating || isUpdating;

  // Form State
  const [formValues, setFormValues] = useState<BrandFormValues>(() => {
    if (existingBrand) {
      const isPreset = PRESET_TAGS.includes(existingBrand.tagline || "");
      return {
        name: existingBrand.name,
        tagline: isPreset ? existingBrand.tagline || "" : PRESET_TAGS[0],
        customTagline: isPreset ? "" : existingBrand.tagline || "",
        isFeaturedMarquee: Boolean(existingBrand.isFeaturedMarquee),
        description: existingBrand.description || "",
      };
    }
    return EMPTY_FORM;
  });

  // Logo / Asset State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => existingBrand?.image || null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(() => existingBrand?.image || null);

  // Success Modal
  const [confirmModal, setConfirmModal] = useState<ConfirmationDialogState | null>(null);
  const [lastSavedName, setLastSavedName] = useState("");

  // Sync state if existingBrand changes
  React.useEffect(() => {
    if (existingBrand) {
      const isPreset = PRESET_TAGS.includes(existingBrand.tagline || "");
      setFormValues({
        name: existingBrand.name,
        tagline: isPreset ? existingBrand.tagline || "" : PRESET_TAGS[0],
        customTagline: isPreset ? "" : existingBrand.tagline || "",
        isFeaturedMarquee: Boolean(existingBrand.isFeaturedMarquee),
        description: existingBrand.description || "",
      });
      setLogoUrl(existingBrand.image || null);
      setLogoImageUrl(existingBrand.image || null);
    }
  }, [existingBrand]);

  const handleFieldChange = <K extends keyof BrandFormValues>(
    key: K,
    value: BrandFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
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

    setLogoFile(file);
    const preview = URL.createObjectURL(file);
    setLogoUrl(preview);
    setLogoImageUrl(null);
    e.target.value = "";
  };

  const handleLogoUrlSet = (url: string) => {
    setLogoFile(null);
    setLogoUrl(url);
    setLogoImageUrl(url);
    setLogoError(null);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoUrl(null);
    setLogoImageUrl(null);
    setLogoError(null);
  };

  const resetForm = () => {
    setFormValues(EMPTY_FORM);
    setLogoFile(null);
    setLogoUrl(null);
    setLogoImageUrl(null);
    setLogoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim()) return;

    const finalTagline = formValues.customTagline.trim() || formValues.tagline;
    const savedName = formValues.name.trim();

    const payload = {
      name: savedName,
      tagline: finalTagline,
      description: formValues.description.trim() || undefined,
      isFeaturedMarquee: formValues.isFeaturedMarquee,
      image: logoFile || undefined,
      imageUrl: !logoFile && logoImageUrl ? logoImageUrl : undefined,
      removeImage: isEditMode && !logoUrl && Boolean(existingBrand?.image),
    };

    try {
      if (isEditMode && resolvedId) {
        await updateBrand({ id: resolvedId, payload }).unwrap();
        setLastSavedName(savedName);
        setConfirmModal({
          isOpen: true,
          title: "Brand Updated!",
          message: `"${savedName}" has been successfully updated in your brand catalog.`,
          confirmLabel: "View Brands",
          cancelLabel: "Keep Editing",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            router.push("/dashboard/brands");
          },
        });
      } else {
        await createBrand(payload).unwrap();
        setLastSavedName(savedName);
        // Reset form immediately after successful creation
        resetForm();
        setConfirmModal({
          isOpen: true,
          title: "Brand Created!",
          message: `"${savedName}" has been successfully registered to your brand catalog.`,
          confirmLabel: "View Brands",
          cancelLabel: "Create Another",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            router.push("/dashboard/brands");
          },
        });
      }
    } catch (error) {
      console.error("Failed to save brand:", error);
    }
  };

  if (brandId && isLoading) {
    return (
      <PageLoader
        title="Loading Brand..."
        description="Fetching brand details, logo, and partnership settings."
        badgeText="Brand Catalog"
      />
    );
  }

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
              <span className="text-xs text-muted-foreground">
                {isEditMode ? "Edit Partnership" : "New Partnership"}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              {isEditMode ? `Edit Brand: ${existingBrand?.name || "Brand"}` : "Create Brand"}
            </h1>
          </div>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form + Upload (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <BrandLogoUploadCard
              logoUrl={logoUrl}
              logoError={logoError}
              maxFileSizeMb={MAX_FILE_SIZE_MB}
              isExternalUrl={Boolean(logoImageUrl)}
              onLogoSelect={handleLogoSelect}
              onLogoUrlSet={handleLogoUrlSet}
              onRemoveLogo={handleRemoveLogo}
            />

            <BrandPropertiesFormCard
              values={formValues}
              presetTags={PRESET_TAGS}
              isSubmitting={isSubmitting}
              submitLabel={isEditMode ? "Save Brand Changes" : "Save & Register Brand"}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          </form>
        </div>

        {/* RIGHT COLUMN: Live Card Preview (4 cols sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <BrandLivePreviewCard
            name={formValues.name}
            tagline={formValues.customTagline.trim() || formValues.tagline}
            isFeaturedMarquee={formValues.isFeaturedMarquee}
            description={formValues.description}
            logoUrl={logoUrl}
          />
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {confirmModal && (
        <ConfirmationModal
          dialog={confirmModal}
          onClose={() => {
            setConfirmModal(null);
            // "Create Another" — modal dismissed without going to list
          }}
        />
      )}
    </div>
  );
}
