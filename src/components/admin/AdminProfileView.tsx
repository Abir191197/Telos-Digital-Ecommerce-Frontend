"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  KeyRound,
  CheckCircle2,
  Lock,
  Calendar,
  Save,
} from "lucide-react";

export function AdminProfileView() {
  const [profile, setProfile] = useState({
    name: "Admin Administrator",
    role: "Super Administrator / Store Owner",
    email: "admin@telos.com.bd",
    phone: "+880 1700-000000",
    organization: "Telos Digital Marketplace Bangladesh",
    timezone: "Asia/Dhaka (GMT+6)",
  });

  const [passwordState, setPasswordState] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [savedMsg, setSavedMsg] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg("Admin profile updated successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPass !== passwordState.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }
    setPasswordState({ current: "", newPass: "", confirm: "" });
    setSavedMsg("Password updated successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
            <span>Admin Profile & Security</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your store console administrator identity, credentials, and access keys.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Administrator Details */}
        <div className="lg:col-span-8 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl bg-card border border-border/70 p-5 sm:p-7 shadow-lg space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Administrator Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Public display profile within the store administration team.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  Role Designation
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="h-10 w-full rounded-xl bg-muted/20 border border-border/40 px-3.5 text-xs font-semibold text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Primary Email</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(System Locked)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="h-10 w-full rounded-xl bg-muted/20 border border-border/40 px-3.5 text-xs font-semibold text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  Organization / Entity
                </label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) =>
                    setProfile({ ...profile, organization: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Operational Timezone
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.timezone}
                  className="h-10 w-full rounded-xl bg-muted/20 border border-border/40 px-3.5 text-xs font-semibold text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Password & Security Card */}
          <form
            onSubmit={handleUpdatePassword}
            className="rounded-3xl bg-card border border-border/70 p-5 sm:p-7 shadow-lg space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Password & Authentication
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update your console access credentials.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordState.current}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, current: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordState.newPass}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, newPass: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordState.confirm}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, confirm: e.target.value })
                  }
                  className="h-10 w-full rounded-xl bg-muted/40 border border-border/70 px-3.5 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-foreground text-background hover:opacity-90 font-bold text-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (4 cols): Badge, Sessions & Access Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-card border border-border/70 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex flex-col items-center text-center p-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-500 font-black text-2xl shadow-lg">
                AD
              </div>
              <h3 className="text-base font-black text-foreground mt-3">
                {profile.name}
              </h3>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                Super Admin
              </span>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {profile.email}
              </p>
            </div>

            <div className="border-t border-border/40 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Access Level:</span>
                <strong className="text-foreground">Full Tier 1 (Root)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">2FA Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Enforced (SMS/TOTP)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Console Host:</span>
                <span className="font-mono text-foreground font-semibold">
                  telos.internal.bd
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
