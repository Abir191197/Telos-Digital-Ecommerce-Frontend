// ── Custom fetchBaseQuery with Auth ────────────────────
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { useAuthStore } from "@/stores/auth.store";
import { API_URL } from "@/constants";

// Base query with auth header injection
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

// Wrapper that handles 401 (token expired) and clears auth
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired or invalid — clear auth state
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "authRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    useAuthStore.getState().logout();
  }

  return result;
};
