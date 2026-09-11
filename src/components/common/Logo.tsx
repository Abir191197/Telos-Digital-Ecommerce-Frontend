import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export function Logo({
  className = "",
  size = 34,
  showText = true,
  textColor,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Telos Gold Gradient Squircle Icon */}
      <div
        className="relative shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-[#141312] p-[1.5px] shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10.5px] bg-[#141312] p-1">
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="logoCartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Shopping Cart Handle, Arm & Basket Contour */}
            <path
              d="M104 140 H164 L204 316 C208 332 222 344 238 344 H366 C382 344 396 332 400 316 L424 204 C426 194 418 184 408 184 H174"
              stroke="url(#logoCartGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Basket Accent Lines */}
            <path
              d="M214 244 H396"
              stroke="url(#logoCartGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
            <path
              d="M260 196 L244 332"
              stroke="url(#logoCartGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <path
              d="M328 196 L320 332"
              stroke="url(#logoCartGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />

            {/* Cart Wheels */}
            <circle cx="240" cy="404" r="28" fill="url(#logoCartGrad)" />
            <circle cx="364" cy="404" r="28" fill="url(#logoCartGrad)" />
            <circle cx="240" cy="404" r="12" fill="#141312" />
            <circle cx="364" cy="404" r="12" fill="#141312" />

            {/* Dynamic Sparkle Accent top right */}
            <path
              d="M366 100 L372 118 L390 124 L372 130 L366 148 L360 130 L342 124 L360 118 Z"
              fill="url(#logoCartGrad)"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography matching mother concern Telos Digital */}
      {showText && (
        <span
          className={`text-lg font-bold tracking-tight flex items-center gap-1.5 font-sans ${
            textColor || "text-foreground"
          }`}
        >
          TELOS <span className="text-amber-500 font-semibold text-base tracking-normal">CART</span>
        </span>
      )}
    </div>
  );
}
