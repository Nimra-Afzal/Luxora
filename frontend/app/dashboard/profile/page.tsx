"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/features/authSlice";
import { toggleTheme } from "@/redux/features/themeSlice";
import { Camera, Lock, Save, User, Mail, Phone, MapPin, Sun, Moon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Load profile
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    (async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data.user;

        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // Upload avatar
  async function handleAvatarUpload() {
    if (!avatarFile) return form.avatar;

    const formData = new FormData();
    formData.append("image", avatarFile);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  }

  // Save profile
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const avatarUrl = avatarFile ? await handleAvatarUpload() : form.avatar;

      const res = await api.put("/auth/profile", {
        ...form,
        avatar: avatarUrl,
      });

      dispatch(setUser(res.data.user));

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  // Change password
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    try {
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast({
        title: "Password Changed",
        description: "Please login again with your new password.",
      });

      localStorage.clear();
      window.location.href = "/login";
    } catch (err: any) {
      toast({
        title: "Password update failed",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and preferences
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Avatar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-4 border-blue-100 dark:border-blue-900">
                    {form.avatar ? (
                      <AvatarImage src={form.avatar} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {form.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setAvatarFile(file);
                        setForm({ ...form, avatar: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {form.username || "User"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {form.email}
                </p>

                {user?.role && (
                  <span className={`mt-3 px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Appearance Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Appearance
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {themeMode === "dark" ? (
                    <Moon size={20} className="text-blue-500" />
                  ) : (
                    <Sun size={20} className="text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {themeMode === "dark" ? "Currently enabled" : "Currently disabled"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={themeMode === "dark"}
                  onCheckedChange={handleToggleTheme}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User size={14} className="text-gray-500" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-500" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Enter your address"
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                <div className="pt-2">
                  <Button disabled={saving} className="w-full sm:w-auto">
                    <Save size={16} className="mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Password Change */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock size={18} className="text-gray-500" />
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="old-password">Current Password</Label>
                  <Input
                    id="old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-gray-50 dark:bg-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  >
                    <Lock size={16} className="mr-2" />
                    {changingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
