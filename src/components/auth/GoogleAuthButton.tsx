"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/services/api/auth/authApi";
import { mapBackendUserToCustomerUser, useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddToCartMutation } from "@/services/api/cart/cartApi";
import { useAddToWishlistMutation } from "@/services/api/wishlist/wishlistApi";

const setAuthCookies = (accessToken: string, role: string) => {
  document.cookie = `accessToken=${encodeURIComponent(
    accessToken,
  )}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `authRole=${encodeURIComponent(
    role,
  )}; path=/; max-age=86400; SameSite=Lax`;
};

interface GoogleAuthButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  onError?: (msg: string) => void;
}

export function GoogleAuthButton({
  text = "continue_with",
  onError,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");
  const action = searchParams?.get("action");
  const productId = searchParams?.get("productId");
  const quantityParam = searchParams?.get("quantity");
  const variantIdParam = searchParams?.get("variantId");

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isVerifying, setIsVerifying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<string>("400");

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          // Google GSI accepts width between 200 and 400 pixels
          const clamped = Math.min(400, Math.max(200, Math.floor(measured)));
          setButtonWidth(String(clamped));
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handlePendingAction = async () => {
    if (!productId) return;
    try {
      if (action === "add-to-cart") {
        const qty = quantityParam ? parseInt(quantityParam, 10) : 1;
        await addToCartMutation({
          productId,
          quantity: isNaN(qty) ? 1 : qty,
          variantId: variantIdParam || undefined,
        }).unwrap();
      } else if (action === "add-to-wishlist") {
        await addToWishlistMutation({ productId }).unwrap();
      }
    } catch (err) {
      console.error("Failed to execute pending action on google login:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.("No credentials received from Google");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await googleLogin({
        idToken: credentialResponse.credential,
      }).unwrap();

      const { accessToken, user } = response.data;
      setAuth(mapBackendUserToCustomerUser(user), accessToken);
      setAuthCookies(accessToken, user.role);

      await handlePendingAction();

      const redirect =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : ROUTES.HOME;
      router.push(redirect);
      router.refresh();
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        "Google authentication failed. Please try again.";
      onError?.(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center my-1 relative"
    >
      {isVerifying || isLoading ? (
        <div
          style={{ width: `${buttonWidth}px`, maxWidth: "100%" }}
          className="h-10 flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 text-xs font-medium text-muted-foreground animate-pulse"
        >
          <svg className="animate-spin h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Authenticating with Google...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center overflow-hidden rounded-lg">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              onError?.("Google authentication was cancelled or failed.")
            }
            text={text}
            theme="outline"
            size="large"
            shape="rectangular"
            width={buttonWidth}
            logo_alignment="left"
          />
        </div>
      )}
    </div>
  );
}
