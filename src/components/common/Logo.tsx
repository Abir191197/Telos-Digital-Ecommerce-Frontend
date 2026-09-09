import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 34, showText = true }: LogoProps) {
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
              <linearGradient id="logoTGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            {/* Top Bar of T */}
            <rect x="136" y="142" width="240" height="60" rx="6" fill="url(#logoTGrad)" />
            {/* T Stem */}
            <rect x="224" y="202" width="64" height="124" fill="url(#logoTGrad)" />
            {/* Cart Basket Contour */}
            <path
              d="M168 214 L196 326 C199 338 210 348 224 348 H344 C358 348 368 338 372 324 L396 238 H174"
              stroke="url(#logoTGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cart Wheels */}
            <circle cx="236" cy="388" r="22" fill="url(#logoTGrad)" />
            <circle cx="332" cy="388" r="22" fill="url(#logoTGrad)" />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography matching mother concern Telos Digital */}
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
          TELOS <span className="text-amber-600 font-semibold text-base tracking-normal">CART</span>
        </span>
      )}
    </div>
  );
}
