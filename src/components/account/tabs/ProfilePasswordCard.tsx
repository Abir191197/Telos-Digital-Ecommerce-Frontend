"use client";

import React from "react";
import { Lock, Edit3, CheckCircle2, X, Check } from "lucide-react";

interface ProfilePasswordCardProps {
  showPasswordForm: boolean;
  setShowPasswordForm: (val: boolean) => void;
  passwordSaved: boolean;
  passwordError: string | null;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isChangingPassword: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfilePasswordCard({
  showPasswordForm,
  setShowPasswordForm,
  passwordSaved,
  passwordError,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isChangingPassword,
  onSubmit,
  onCancel,
}: ProfilePasswordCardProps) {
  return (
    <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Password</h3>
            <p className="text-xs text-muted-foreground">Change your account password</p>
          </div>
        </div>
        {!showPasswordForm && (
          <button
            type="button"
            onClick={() => setShowPasswordForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            <span>Change Password</span>
          </button>
        )}
      </div>

      {passwordSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/40 p-3 text-xs font-bold text-amber-700 dark:text-amber-400 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {passwordError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/40 p-3 text-xs font-bold text-rose-700 dark:text-rose-400 animate-in fade-in">
          <X className="h-4 w-4 shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}

      {showPasswordForm && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Current Password</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="h-10 sm:h-11 w-full rounded-xl border border-border bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>New Password</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="h-10 sm:h-11 w-full rounded-xl border border-border bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Confirm New Password</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-10 sm:h-11 w-full rounded-xl border border-border bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <>
                  <div className="h-4 w-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  <span>Changing...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
