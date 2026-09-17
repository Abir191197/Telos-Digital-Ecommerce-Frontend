import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Category, Subcategory } from "@/types/ecommerce.types";

type BackendMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type BackendListResponse<T> = ApiResponse<T[]> & {
  meta?: BackendMeta;
};

export type CategoryFormPayload = {
  name: string;
  description?: string;
  icon?: string;
  subCategories?: Array<{ name: string; description?: string; isActive?: boolean }>;
  isActive?: boolean;
  isFeaturedHomepage?: boolean;
  removeImage?: boolean;
  image?: File | null;
};

export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  isFeaturedHomepage?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const normalizeSubcategory = (subCategory: Subcategory): Subcategory => ({
  ...subCategory,
  itemCount: subCategory.itemCount || 0,
});

export const normalizeCategory = (category: Category): Category => {
  const subCategories = (category.subCategories || category.subcategories || []).map(
    normalizeSubcategory,
  );

  return {
    ...category,
    description: category.description || "",
    icon: category.icon || "LayoutGrid",
    itemCount: category.itemCount || 0,
    featured: category.featured ?? Boolean(category.isFeaturedHomepage),
    isFeaturedHomepage:
      category.isFeaturedHomepage ?? Boolean(category.featured),
    subcategories: subCategories,
    subCategories,
  };
};

const appendOptional = (
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined,
) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
};

const buildCategoryFormData = (payload: CategoryFormPayload) => {
  const formData = new FormData();

  appendOptional(formData, "name", payload.name);
  appendOptional(formData, "description", payload.description);
  appendOptional(formData, "icon", payload.icon);
  if (payload.subCategories) {
    formData.append("subCategories", JSON.stringify(payload.subCategories));
  }
  appendOptional(formData, "isActive", payload.isActive);
  appendOptional(
    formData,
    "isFeaturedHomepage",
    payload.isFeaturedHomepage,
  );
  appendOptional(formData, "removeImage", payload.removeImage);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      BackendListResponse<Category>,
      CategoryQueryParams | void
    >({
      query: (params) => ({
        url: "/categories",
        params: params || undefined,
      }),
      transformResponse: (response: BackendListResponse<Category>) => ({
        ...response,
        data: response.data.map(normalizeCategory),
      }),
      providesTags: ["Category"],
    }),
    getParentCategories: builder.query<Category[], void>({
      query: () => "/categories/parents",
      transformResponse: (response: ApiResponse<Category[]>) =>
        response.data.map(normalizeCategory),
      providesTags: ["Category"],
    }),
    getCategoryTree: builder.query<Category[], void>({
      query: () => "/categories/tree",
      transformResponse: (response: ApiResponse<Category[]>) =>
        response.data.map(normalizeCategory),
      providesTags: ["Category"],
    }),
    getFeaturedHomepageCategories: builder.query<Category[], void>({
      query: () => "/categories/featured-homepage",
      transformResponse: (response: ApiResponse<Category[]>) =>
        response.data.map(normalizeCategory),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: ApiResponse<Category>) =>
        normalizeCategory(response.data),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, CategoryFormPayload>({
      query: (payload) => ({
        url: "/categories",
        method: "POST",
        body: buildCategoryFormData(payload),
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        normalizeCategory(response.data),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; payload: CategoryFormPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: buildCategoryFormData(payload),
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        normalizeCategory(response.data),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        normalizeCategory(response.data),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetParentCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetFeaturedHomepageCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
