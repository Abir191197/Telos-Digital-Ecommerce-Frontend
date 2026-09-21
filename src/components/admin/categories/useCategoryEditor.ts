"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/services/api/categories/categoryApi";
import { type ConfirmationDialogState } from "@/components/common";
import { type CategoryFormValues } from "./CategoryPropertiesFormCard";
import { normalizeCategoryIconName } from "@/components/categories/categoryConfig";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DEFAULT_CATEGORY_FORM_VALUES: CategoryFormValues = {
  name: "",
  description: "",
  icon: "Smartphone",
  featured: false,
  isActive: true,
};

interface UseCategoryEditorParams {
  initialTab?: "create" | "list";
  categoryId?: string;
  categorySlug?: string;
}

export function useCategoryEditor({
  initialTab = "create",
  categoryId,
  categorySlug,
}: UseCategoryEditorParams = {}) {
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmationDialogState | null>(null);
  const [currentView, setCurrentView] = useState<"create" | "list">(initialTab);

  const { data: allCategoriesResponse } = useGetCategoriesQuery(
    { limit: 200 },
    { skip: !categorySlug }
  );
  const resolvedId = categorySlug
    ? (allCategoriesResponse?.data ?? []).find((c) => c.slug === categorySlug)?.id
    : categoryId;

  const {
    data: editingCategory,
    isLoading: isLoadingCategory,
    error: categoryLoadError,
  } = useGetCategoryByIdQuery(resolvedId || "", {
    skip: !resolvedId,
  });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const isEditMode = Boolean(editingCategory);

  const [formValues, setFormValues] = useState<CategoryFormValues>(DEFAULT_CATEGORY_FORM_VALUES);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [lastCreatedCategory, setLastCreatedCategory] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setFormValues({
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: normalizeCategoryIconName(editingCategory.icon),
        featured: Boolean(editingCategory.featured),
        isActive: editingCategory.isActive ?? true,
      });
      setBannerUrl(editingCategory.image || null);
      setBannerImageUrl(editingCategory.image || null);
      setSelectedBannerFile(null);
      setSubcategories(editingCategory.subcategories?.map((sub) => sub.name) || []);
    }
  }, [editingCategory]);

  const handleFieldChange = <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K]
  ) => {
    setFormValues((prev: CategoryFormValues) => ({ ...prev, [key]: value }));
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setBannerError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setBannerError(
        `Banner file "${file.name}" (${sizeMb}MB) exceeds ${MAX_FILE_SIZE_MB}MB maximum. Please use an optimized image.`
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedBannerFile(file);
    setBannerUrl(previewUrl);
    setBannerImageUrl(null);
    e.target.value = "";
  };

  const handleBannerUrlSet = (url: string) => {
    setSelectedBannerFile(null);
    setBannerUrl(url);
    setBannerImageUrl(url);
    setBannerError(null);
  };

  const handleBannerRemove = () => {
    setSelectedBannerFile(null);
    setBannerUrl(null);
    setBannerImageUrl(null);
  };

  const handleAddSubcategory = (name: string) => {
    setSubcategories((prev) => [...prev, name]);
  };

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetForm = () => {
    if (editingCategory) {
      setFormValues({
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: normalizeCategoryIconName(editingCategory.icon),
        featured: Boolean(editingCategory.featured),
        isActive: editingCategory.isActive ?? true,
      });
      setBannerUrl(editingCategory.image || null);
      setBannerImageUrl(editingCategory.image || null);
      setSelectedBannerFile(null);
      setSubcategories(editingCategory.subcategories?.map((sub) => sub.name) || []);
    } else {
      setFormValues(DEFAULT_CATEGORY_FORM_VALUES);
      setBannerUrl(null);
      setBannerImageUrl(null);
      setSelectedBannerFile(null);
      setSubcategories([]);
    }
    setSuccessToast(false);
    setFormError(null);
  };

  const getApiErrorMessage = (error: unknown) => {
    if (
      error &&
      typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      return String(error.data.message);
    }
    return "Category could not be saved. Please check the form and try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim()) return;

    if (formValues.featured && !selectedBannerFile && !bannerUrl) {
      setBannerError("Featured homepage categories require an uploaded image.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        icon: normalizeCategoryIconName(formValues.icon),
        subCategories: subcategories.map((name) => ({
          name,
          isActive: true,
        })),
        isActive: formValues.isActive,
        isFeaturedHomepage: formValues.featured,
        image: selectedBannerFile,
        imageUrl: !selectedBannerFile && bannerImageUrl ? bannerImageUrl : undefined,
        removeImage: isEditMode && !bannerUrl && Boolean(editingCategory?.image),
      };

      const submittedCategoryName = formValues.name.trim();

      if (isEditMode && editingCategory) {
        await updateCategory({ id: editingCategory.id, payload }).unwrap();
        setConfirmModal({
          isOpen: true,
          title: "Category Updated Successfully!",
          message: `"${submittedCategoryName}" and its settings have been updated in the catalog.`,
          confirmLabel: "View Categories",
          cancelLabel: "Keep Editing",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            setCurrentView("list");
            router.push("/dashboard/categories");
          },
          onCancel: () => {
            setConfirmModal(null);
          },
        });
      } else {
        await createCategory(payload).unwrap();

        setFormValues(DEFAULT_CATEGORY_FORM_VALUES);
        setSubcategories([]);
        setBannerUrl(null);
        setBannerImageUrl(null);
        setSelectedBannerFile(null);
        setBannerError(null);
        setFormError(null);

        setConfirmModal({
          isOpen: true,
          title: "Category Created Successfully!",
          message: `"${submittedCategoryName}" has been published and added to your store's live catalog.`,
          confirmLabel: "View Categories",
          cancelLabel: "Create Another",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            setCurrentView("list");
            router.push("/dashboard/categories");
          },
          onCancel: () => {
            setConfirmModal(null);
          },
        });
      }

      setLastCreatedCategory(submittedCategoryName);
      setSuccessToast(true);
      setSelectedBannerFile(null);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editingCategory,
    isLoadingCategory,
    categoryLoadError,
    isEditMode,
    currentView,
    setCurrentView,
    formValues,
    handleFieldChange,
    subcategories,
    handleAddSubcategory,
    handleRemoveSubcategory,
    bannerUrl,
    bannerError,
    setBannerError,
    handleBannerSelect,
    handleBannerRemove,
    handleBannerUrlSet,
    handleResetForm,
    handleSubmit,
    isSubmitting,
    successToast,
    lastCreatedCategory,
    formError,
    confirmModal,
    setConfirmModal,
  };
}
