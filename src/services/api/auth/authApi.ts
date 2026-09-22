// ── Auth API Endpoints ─────────────────────────────────
// Injected into the single baseApi instance.
// This is the pattern all feature API files should follow.

import { baseApi } from "@/lib/rtk-query/baseApi";
import type {
  BackendAuthResponse,
  BackendAuthUser,
  ChangePasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
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
    updateProfile: builder.mutation<
      ApiResponse<BackendAuthUser>,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
        googleLogin: builder.mutation<
      ApiResponse<BackendAuthResponse>,
      GoogleLoginRequest
    >({
      query: (body) => ({
        url: "/google",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
