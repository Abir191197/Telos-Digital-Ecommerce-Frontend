"use client";

import React, { useState, useEffect } from "react";
import type { CustomerUser } from "@/stores";
import type { Order } from "@/types/order.types";
import { useUpdateProfileMutation, useChangePasswordMutation } from "@/services/api/auth/authApi";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfilePasswordCard } from "./ProfilePasswordCard";
import { ProfileInsightsCards } from "./ProfileInsightsCards";
import { ProfileConfirmModal } from "./ProfileConfirmModal";

interface ProfileTabProps {
  user: CustomerUser;
  orders: Order[];
  onUpdateUser: (updated: Partial<CustomerUser>) => void;
}

export function ProfileTab({ user, orders, onUpdateUser }: ProfileTabProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileConfirmModal, setShowProfileConfirmModal] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  useEffect(() => {
    if (!isEditingProfile) {
      setProfileName(user.name);
      setProfileAvatar(user.avatar || "");
    }
  }, [user, isEditingProfile]);

  const handleProfileFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setShowProfileConfirmModal(true);
  };

  const handleConfirmProfileSave = async () => {
    setIsSaving(true);
    setProfileError(null);
    try {
      const updates: Record<string, string> = {};
      if (profileName.trim() !== user.name) {
        updates.name = profileName.trim();
      }
      if (profileAvatar !== (user.avatar || "")) {
        updates.avatar = profileAvatar;
      }
      const res = await updateProfile(updates).unwrap();
      onUpdateUser({
        name: res.data.name,
        avatar: res.data.avatar || "",
      });
      setShowProfileConfirmModal(false);
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileName(user.name);
    setProfileAvatar(user.avatar || "");
    setIsEditingProfile(false);
    setShowProfileConfirmModal(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Personal Info & Avatar Card */}
      <ProfileInfoCard
        user={user}
        isEditingProfile={isEditingProfile}
        setIsEditingProfile={setIsEditingProfile}
        profileName={profileName}
        setProfileName={setProfileName}
        profileAvatar={profileAvatar}
        setProfileAvatar={setProfileAvatar}
        profileSaved={profileSaved}
        profileError={profileError}
        onSubmit={handleProfileFormSubmit}
        onCancel={handleCancelProfileEdit}
      />

      {/* Security & Password Change Card */}
      <ProfilePasswordCard
        showPasswordForm={showPasswordForm}
        setShowPasswordForm={setShowPasswordForm}
        passwordSaved={passwordSaved}
        passwordError={passwordError}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        isChangingPassword={isChangingPassword}
        onSubmit={handlePasswordChange}
        onCancel={() => {
          setShowPasswordForm(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordError(null);
        }}
      />

      {/* Order & Account Insights */}
      <ProfileInsightsCards orders={orders} />

      {/* Profile Save Confirmation Modal */}
      <ProfileConfirmModal
        isOpen={showProfileConfirmModal}
        onClose={() => setShowProfileConfirmModal(false)}
        onConfirm={handleConfirmProfileSave}
        isSaving={isSaving}
        user={user}
        profileName={profileName}
        profileAvatar={profileAvatar}
      />
    </div>
  );
}
