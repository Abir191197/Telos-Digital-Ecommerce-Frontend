"use client";

import React, { useRef, useEffect, useState } from "react";
import { m, useInView, animate } from "framer-motion";

export function AnimatedStatNumber({
  target,
  prefix = "",
  suffix = "",
  formatComma = false,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  formatComma?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, target]);

  const formatted = formatComma
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
