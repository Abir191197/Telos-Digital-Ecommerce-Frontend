"use client";

import { useState, useEffect } from "react";

interface LocationItem {
  value: number;
  title: string;
}

interface LocationData {
  divisions: LocationItem[];
  districts: Record<string, LocationItem[]>;
  upazilas: Record<string, LocationItem[]>;
  unions: Record<string, LocationItem[]>;
}

export function useBDLocation() {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/Address/bd-locations-en.json")
      .then((res) => res.json())
      .then((json) => {
        setData({
          divisions: json.divisions_en || [],
          districts: json.districts_en || {},
          upazilas: json.upazilas_en || {},
          unions: json.unions_en || {},
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
