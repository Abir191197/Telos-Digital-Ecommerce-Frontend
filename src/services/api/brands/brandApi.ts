import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Brand } from "@/types/ecommerce.types";

type BackendMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type BackendListResponse<T> = ApiResponse<T[]> & {
  meta?: BackendMeta;
};

export type BrandFormPayload = {
  name: string;
  tagline?: string;
  description?: string;
  isActive?: boolean;
  isFeaturedMarquee?: boolean;
  removeImage?: boolean;
  image?: File | null;
  imageUrl?: string | null;
};

export type BrandQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  isFeaturedMarquee?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const appendOptional = (
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined,
) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
};

const buildBrandFormData = (payload: BrandFormPayload) => {
  const formData = new FormData();

  appendOptional(formData, "name", payload.name);
  appendOptional(formData, "tagline", payload.tagline);
  appendOptional(formData, "description", payload.description);
  appendOptional(formData, "isActive", payload.isActive);
  appendOptional(formData, "isFeaturedMarquee", payload.isFeaturedMarquee);
  appendOptional(formData, "removeImage", payload.removeImage);
  appendOptional(formData, "imageUrl", payload.imageUrl);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const normalizeBrand = (brand: Brand): Brand => ({
  ...brand,
  tagline: brand.tagline || null,
  description: brand.description || null,
  isActive: brand.isActive ?? true,
  isFeaturedMarquee: brand.isFeaturedMarquee ?? false,
});

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BackendListResponse<Brand>, BrandQueryParams | void>({
      query: (params) => ({
        url: "/brands",
        params: params || undefined,
      }),
      transformResponse: (response: BackendListResponse<Brand>) => ({
        ...response,
        data: response.data.map(normalizeBrand),
      }),
      providesTags: ["Brand"],
    }),
    getMarqueeBrands: builder.query<Brand[], void>({
      query: () => "/brands/marquee",
      transformResponse: (response: ApiResponse<Brand[]>) =>
        response.data.map(normalizeBrand),
      providesTags: ["Brand"],
    }),
    getBrandById: builder.query<Brand, string>({
      query: (id) => `/brands/${id}`,
      transformResponse: (response: ApiResponse<Brand>) =>
        normalizeBrand(response.data),
      providesTags: ["Brand"],
    }),
    getBrandBySlug: builder.query<Brand, string>({
      query: (slug) => `/brands/slug/${slug}`,
      transformResponse: (response: ApiResponse<Brand>) =>
        normalizeBrand(response.data),
      providesTags: ["Brand"],
    }),
    createBrand: builder.mutation<Brand, BrandFormPayload>({
      query: (payload) => ({
        url: "/brands",
        method: "POST",
        body: buildBrandFormData(payload),
      }),
      transformResponse: (response: ApiResponse<Brand>) =>
        normalizeBrand(response.data),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<Brand, { id: string; payload: BrandFormPayload }>({
      query: ({ id, payload }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: buildBrandFormData(payload),
      }),
      transformResponse: (response: ApiResponse<Brand>) =>
        normalizeBrand(response.data),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation<Brand, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<Brand>) =>
        normalizeBrand(response.data),
      invalidatesTags: ["Brand"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetMarqueeBrandsQuery,
  useGetBrandByIdQuery,
  useGetBrandBySlugQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
