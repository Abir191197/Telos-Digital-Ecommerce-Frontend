// ── Authentication Types ───────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "manager" | "user";
export type BackendUserRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "admin" | (string & {});

export interface LoginRequest {
  email?: string;
  phone?: string;
  mobile?: string;
  identifier?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface BackendAddress {
  id: string;
  title: string | null;
  type: "SHIPPING" | "BILLING";
  isDefault: boolean;
  street: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

export interface BackendAuthUser {
  id: string;
  customerId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: BackendUserRole;
  status: string;
  addresses?: BackendAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: BackendAuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
