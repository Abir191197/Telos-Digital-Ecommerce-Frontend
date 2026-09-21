"use client";

import React, { useRef } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Edit3,
  Upload,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";
import { AppImage } from "@/components/shared";
import type { CustomerUser } from "@/stores";

interface ProfileInfoCardProps {
  user: CustomerUser;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  profileName: string;
  setProfileName: (val: string) => void;
  profileAvatar: string;
  setProfileAvatar: (val: string) => void;
  profileSaved: boolean;
  profileError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfileInfoCard({
  user,
  isEditingProfile,
  setIsEditingProfile,
  profileName,
  setProfileName,
  profileAvatar,
  setProfileAvatar,
  profileSaved,
  profileError,
  onSubmit,
  onCancel,
}: ProfileInfoCardProps) {
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setProfileAvatar(event.target.result);
        setIsEditingProfile(true);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border-b border-border/50 pb-5 sm:pb-6">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={avatarFileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              title="Click to upload profile photo"
              className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-amber-500/80 overflow-hidden bg-muted/30 flex items-center justify-center font-black text-amber-600 text-xl sm:text-2xl shadow-md shadow-amber-500/20 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <AppImage
                src={(isEditingProfile ? profileAvatar : user.avatar) || ""}
                alt={profileName || user.name}
                fill
                className="object-cover"
                fallbackIcon={
                  <span className="font-black text-amber-600 text-xl sm:text-2xl">
                    {(profileName || user.name).charAt(0).toUpperCase()}
                  </span>
                }
                containerClassName="p-0 bg-transparent"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5 z-10">
                <Upload className="h-3.5 w-3.5" />
                <span>Change</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              title="Upload new photo"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 shadow-xs ring-2 ring-background cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <Camera className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate max-w-[200px] sm:max-w-none">
                {isEditingProfile ? (profileName || "Your Name") : user.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold shrink-0">
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Verified
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span>Telos Member</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Change photo
              </button>
            </p>
          </div>
        </div>

        {!isEditingProfile && (
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>

      {profileSaved && (
        <div className="mt-4 sm:mt-5 flex items-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/40 p-3 sm:p-3.5 text-xs font-bold text-amber-700 dark:text-amber-400 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Profile information saved successfully!</span>
        </div>
      )}

      {profileError && (
        <div className="mt-4 sm:mt-5 flex items-center gap-2 rounded-xl sm:rounded-2xl bg-rose-500/15 border border-rose-500/40 p-3 sm:p-3.5 text-xs font-bold text-rose-700 dark:text-rose-400 animate-in fade-in">
          <X className="h-4 w-4 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 sm:mt-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {/* Full Name */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3.5 sm:p-4 space-y-2 transition-all">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span>Full Name</span>
              </label>
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-md transition-colors"
                  title="Edit full name"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
                className="h-10 sm:h-11 w-full rounded-xl border border-amber-500/80 bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              />
            ) : (
              <p className="text-sm font-bold text-foreground py-0.5 sm:py-1 truncate">
                {user.name}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/20 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 transition-all">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Phone Number</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Locked</span>
              </span>
            </div>
            <p className="text-sm font-bold font-mono text-foreground py-0.5 sm:py-1 truncate">
              {user.phone || "Not provided"}
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              Phone number cannot be changed for security reasons
            </p>
          </div>

          {/* Email Address */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/20 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Email Address</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                <Lock className="h-3 w-3" />
                Secured
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
              Primary account identifier linked to order dispatches and OTP verification.
            </p>
          </div>
        </div>

        {isEditingProfile && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 text-center"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
