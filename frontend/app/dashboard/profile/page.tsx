"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setUser, setUserFromStorage } from "@/redux/features/authSlice";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔐 Restore auth state
  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  // 📡 Load profile
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
          title: "Unauthorized",
          description: "Please login again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // 📸 Upload avatar
  async function handleAvatarUpload() {
    if (!avatarFile) return form.avatar;

    const formData = new FormData();
    formData.append("image", avatarFile);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  }

  // 💾 Save profile
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
        title: "Profile Updated 🎉",
        description: "Your changes were saved.",
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

  // 🔑 Change password
  // 🔑 Change password
async function handlePasswordChange(e: React.FormEvent) {
  e.preventDefault();

  try {
    await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });

    toast({
      title: "Password changed",
      description: "Please login again with your new password.",
    });

    // ✅ IMPORTANT: clear auth state
    localStorage.clear();

    // redirect to login
    window.location.href = "/login";
  } catch (err: any) {
    toast({
      title: "Password update failed",
      description: err.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
}


  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardContent className="p-6 space-y-8">
          <h1 className="text-2xl font-bold">Profile Settings</h1>

          {/* PROFILE FORM */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                {form.avatar ? (
                  <AvatarImage src={form.avatar} />
                ) : (
                  <AvatarFallback>
                    {form.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    setAvatarFile(file);
                    setForm({ ...form, avatar: URL.createObjectURL(file) });
                  }
                }}
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <Button disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          <hr />

          {/* PASSWORD FORM */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h2 className="font-semibold">Change Password</h2>

            <Input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button>Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

