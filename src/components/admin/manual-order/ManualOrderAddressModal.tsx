"use client";

import { useEffect, useMemo, useState } from "react";
import { Building, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBDLocation } from "@/hooks/useBDLocation";

export interface ManualOrderAddressValues {
  label: "Home" | "Office" | "Other";
  name: string;
  phone: string;
  street: string;
  area?: string;
  union?: string;
  city: string;
  zone: "inside-dhaka" | "outside-dhaka";
}

interface ManualOrderAddressModalProps {
  isOpen: boolean;
  initialValues: ManualOrderAddressValues;
  onClose: () => void;
  onAdd: (values: ManualOrderAddressValues) => void;
}

export function ManualOrderAddressModal({
  isOpen,
  initialValues,
  onClose,
  onAdd,
}: ManualOrderAddressModalProps) {
  const { data: locationData, loading: locationLoading } = useBDLocation();
  const [values, setValues] = useState<ManualOrderAddressValues>(initialValues);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");
  const [selectedUnionId, setSelectedUnionId] = useState("");

  const availableDistricts = useMemo(() => {
    if (!locationData) return [];
    return Object.values(locationData.districts)
      .flat()
      .sort((first, second) => first.title.localeCompare(second.title));
  }, [locationData]);

  const availableUpazilas = useMemo(
    () => (selectedDistrictId ? locationData?.upazilas[selectedDistrictId] || [] : []),
    [locationData, selectedDistrictId]
  );

  const availableUnions = useMemo(
    () => (selectedUpazilaId ? locationData?.unions[selectedUpazilaId] || [] : []),
    [locationData, selectedUpazilaId]
  );

  useEffect(() => {
    if (!isOpen) return;

    setValues(initialValues);
    const district = availableDistricts.find(
      (item) => item.title.toLowerCase() === initialValues.city.toLowerCase()
    );
    const districtId = district ? String(district.value) : "";
    const upazila = districtId && initialValues.area
      ? locationData?.upazilas[districtId]?.find(
          (item) => item.title.toLowerCase() === initialValues.area?.toLowerCase()
        )
      : undefined;
    const upazilaId = upazila ? String(upazila.value) : "";
    const union = upazilaId && initialValues.union
      ? locationData?.unions[upazilaId]?.find(
          (item) => item.title.toLowerCase() === initialValues.union?.toLowerCase()
        )
      : undefined;

    setSelectedDistrictId(districtId);
    setSelectedUpazilaId(upazilaId);
    setSelectedUnionId(union ? String(union.value) : "");
  }, [availableDistricts, initialValues, isOpen, locationData]);

  if (!isOpen) return null;

  const handleDistrictChange = (districtId: string) => {
    const district = availableDistricts.find((item) => String(item.value) === districtId);
    setSelectedDistrictId(districtId);
    setSelectedUpazilaId("");
    setSelectedUnionId("");
    setValues((current) => ({
      ...current,
      city: district?.title || "",
      area: "",
      union: "",
      zone: district?.title.toLowerCase().includes("dhaka") ? "inside-dhaka" : "outside-dhaka",
    }));
  };

  const handleUpazilaChange = (upazilaId: string) => {
    const upazila = availableUpazilas.find((item) => String(item.value) === upazilaId);
    setSelectedUpazilaId(upazilaId);
    setSelectedUnionId("");
    setValues((current) => ({ ...current, area: upazila?.title || "", union: "" }));
  };

  const handleUnionChange = (unionId: string) => {
    const union = availableUnions.find((item) => String(item.value) === unionId);
    setSelectedUnionId(unionId);
    setValues((current) => ({ ...current, union: union?.title || "" }));
  };

  const handleSubmit = () => {
    if (!values.name?.trim()) return;
    if (!values.phone?.trim()) return;
    if (!values.city?.trim()) return;
    if (!values.street?.trim()) return;
    onAdd(values);
  };

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border/70 bg-card shadow-2xl animate-in slide-in-from-bottom sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl sm:border sm:zoom-in-95" role="dialog" aria-modal="true" aria-labelledby="manual-order-address-title">
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-card p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 id="manual-order-address-title" className="truncate text-sm font-bold text-foreground sm:text-base">Add New Delivery Location</h3>
              <p className="truncate text-[11px] text-muted-foreground">Destination details for courier deliveries</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto overscroll-contain p-4 text-xs sm:p-5">
          <div>
            <label className="mb-1 block font-bold text-foreground">Address Type / Label</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Home", "Office", "Other"] as const).map((label) => (
                <button key={label} type="button" onClick={() => setValues((current) => ({ ...current, label }))} className={cn("flex cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all", values.label === label ? "bg-amber-500 text-white shadow-xs" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <Building className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block font-bold text-foreground">Recipient Name
              <input required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} placeholder="Full Name" className="mt-1 h-11 w-full rounded-xl bg-muted/40 px-3.5 text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 sm:h-10" />
            </label>
            <label className="block font-bold text-foreground">Phone Number
              <input required type="tel" value={values.phone} onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} placeholder="+880 1712-345678" className="mt-1 h-11 w-full rounded-xl bg-muted/40 px-3.5 font-mono text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 sm:h-10" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <label className="block font-bold text-foreground">District
              <select required value={selectedDistrictId} onChange={(event) => handleDistrictChange(event.target.value)} disabled={locationLoading} className="mt-1 h-11 w-full rounded-xl bg-muted/40 px-3 text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 sm:h-10">
                <option value="">{locationLoading ? "Loading..." : "Select District"}</option>
                {availableDistricts.map((district) => <option key={district.value} value={district.value}>{district.title}</option>)}
              </select>
            </label>
            <label className="block font-bold text-foreground">Upazila
              <select required value={selectedUpazilaId} onChange={(event) => handleUpazilaChange(event.target.value)} disabled={!selectedDistrictId || locationLoading} className="mt-1 h-11 w-full rounded-xl bg-muted/40 px-3 text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 sm:h-10">
                <option value="">{selectedDistrictId ? "Select Upazila" : "Select District first"}</option>
                {availableUpazilas.map((upazila) => <option key={upazila.value} value={upazila.value}>{upazila.title}</option>)}
              </select>
            </label>
            <label className="col-span-2 block font-bold text-foreground sm:col-span-1">Union <span className="font-normal text-muted-foreground">(Optional)</span>
              <select value={selectedUnionId} onChange={(event) => handleUnionChange(event.target.value)} disabled={!selectedUpazilaId || locationLoading || availableUnions.length === 0} className="mt-1 h-11 w-full rounded-xl bg-muted/40 px-3 text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 sm:h-10">
                <option value="">{!selectedUpazilaId ? "Select Upazila first" : availableUnions.length === 0 ? "No unions available" : "Select Union (Optional)"}</option>
                {availableUnions.map((union) => <option key={union.value} value={union.value}>{union.title}</option>)}
              </select>
            </label>
          </div>

          <label className="block font-bold text-foreground">Address
            <textarea required rows={2} value={values.street} onChange={(event) => setValues((current) => ({ ...current, street: event.target.value }))} placeholder="e.g. House 14, Road 3, Block D" className="mt-1 w-full resize-none rounded-xl bg-muted/40 px-3.5 py-3 text-xs font-semibold text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
          </label>

          <div className="flex items-center gap-2.5 border-t border-border/40 pb-6 pt-3 sm:pb-1">
            <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl bg-muted/60 py-3 font-bold text-foreground transition-all hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleSubmit} className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-amber-700">Add Address</button>
          </div>
        </div>
      </div>
    </div>
  );
}
