// ── Auth API Endpoints ─────────────────────────────────
// Injected into the single baseApi instance.
// This is the pattern all feature API files should follow.

import { baseApi } from "@/lib/rtk-query/baseApi";
import type {
  BackendAuthResponse,
  BackendAuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/api.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<BackendAuthResponse>, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    adminLogin: builder.mutation<
      ApiResponse<BackendAuthResponse>,
      Required<Pick<LoginRequest, "email" | "password">>
    >({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation<
      ApiResponse<BackendAuthResponse>,
      RegisterRequest
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    getProfile: builder.query<ApiResponse<BackendAuthUser>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = authApi;
