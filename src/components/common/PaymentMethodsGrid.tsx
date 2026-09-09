import React from "react";
import Image from "next/image";

export function PaymentMethodsGrid() {
  const partners = [
    { name: "American Express", src: "/images/payment-partners/amex.png" },
    { name: "bKash", src: "/images/payment-partners/bkash.png" },
    { name: "Nagad", src: "/images/payment-partners/nagad.png" },
    { name: "Rocket", src: "/images/payment-partners/rocket.webp" },
    { name: "VISA", src: "/images/payment-partners/visa.png" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
        Payment Methods
      </h4>

      {/* Grid with minimal padding around logos */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {partners.map((partner) => {
          const isAmex = partner.name === "American Express";
          return (
            <div
              key={partner.name}
              className="flex h-11 items-center justify-center rounded-md bg-white p-1 overflow-hidden shadow-xs transition-transform hover:scale-105"
              title={partner.name}
            >
              <div
                className={`relative w-full ${
                  isAmex ? "h-10 scale-125" : "h-8"
                }`}
              >
                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  sizes="90px"
                  className="object-contain"
                />
              </div>
            </div>
          );
        })}

        {/* Cash on Delivery Badge */}
        <div
          className="flex h-11 flex-col items-center justify-center rounded-md bg-white p-0.5 shadow-xs transition-transform hover:scale-105 text-center leading-none"
          title="Cash on Delivery"
        >
          <span className="text-[10px] font-bold text-[#002D62] tracking-tight">
            Cash on
          </span>
          <span className="text-[10px] font-black text-[#D12053] tracking-tight mt-0.5">
            Delivery
          </span>
        </div>

        {/* Powered by SSLCOMMERZ with real image asset */}
        <div className="col-span-3 flex h-9 items-center justify-center gap-1.5 rounded-md bg-white px-2 py-1 shadow-xs transition-transform hover:scale-105">
          <span className="text-[10px] text-zinc-500 shrink-0 font-normal select-none">
            Powered by
          </span>
          <div className="relative h-6 w-32">
            <Image
              src="/images/payment-partners/sslcommerz.png"
              alt="SSLCOMMERZ"
              fill
              sizes="140px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
