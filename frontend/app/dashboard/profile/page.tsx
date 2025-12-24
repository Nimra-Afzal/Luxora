
// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/lib/api";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";

// export default function SettingsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { toast } = useToast();
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     address: "",
//     avatar: "",
//   });

//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Load profile data
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/auth/me");
//         const data = res.data.user;

//         setForm({
//           username: data.username || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           address: data.address || "",
//           avatar: data.avatar || "",
//         });
//       } catch (err) {
//         console.error("Failed to load profile", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Avatar upload
//   async function handleAvatarUpload() {
//     if (!avatarFile) return form.avatar;

//     const formData = new FormData();
//     formData.append("image", avatarFile);

//     try {
//       const res = await api.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res.data.url;
//     } catch (err) {
//       console.error("Avatar upload failed", err);
//       return form.avatar;
//     }
//   }

//   // Save profile
//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let avatarUrl = form.avatar;

//       if (avatarFile) {
//         avatarUrl = await handleAvatarUpload();
//       }

//       const payload = {
//         username: form.username,
//         email: form.email,
//         phone: form.phone,
//         address: form.address,
//         avatar: avatarUrl,
//       };

//       const res = await api.put("/auth/profile", payload);

//       // Update Redux manually
//       dispatch({
//         type: "auth/setUserManual",
//         payload: res.data.user,
//       });

//       toast({
//   title: "Profile Updated 🎉",
//   description: "Your changes have been saved successfully.",
//   duration: 3000, // 3 seconds
// });


//     } catch (err: any) {
//       toast({
//         title: "Update Failed",
//         description: err.response?.data?.error || "Something went wrong.",
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading)
//     return <div className="p-10 text-center text-gray-500">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10">
//       <Card className="border border-gray-300 dark:border-gray-700">
//         <CardContent className="p-6">
//           <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

//           <form onSubmit={handleSave} className="space-y-6">

//             {/* Avatar */}
//             <div className="flex items-center gap-6">
//               <Avatar className="h-20 w-20 border">
//                 {form.avatar ? (
//                   <AvatarImage src={form.avatar} />
//                 ) : (
//                   <AvatarFallback>
//                     {form.username.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 )}
//               </Avatar>

//               <div className="flex-1">
//                 <Label>Profile Picture</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0] || null;
//                     if (file) {
//                       setAvatarFile(file);
//                       setForm({ ...form, avatar: URL.createObjectURL(file) });
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Username */}
//             <div>
//               <Label>Username</Label>
//               <Input
//                 value={form.username}
//                 onChange={(e) =>
//                   setForm({ ...form, username: e.target.value })
//                 }
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <Label>Email</Label>
//               <Input
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <Label>Phone</Label>
//               <Input
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm({ ...form, phone: e.target.value })
//                 }
//                 placeholder="e.g. +92 300 1234567"
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <Label>Address</Label>
//               <Input
//                 value={form.address}
//                 onChange={(e) =>
//                   setForm({ ...form, address: e.target.value })
//                 }
//                 placeholder="Enter your address"
//               />
//             </div>

//             <div className="flex gap-4">
//               <Button disabled={saving} type="submit">
//                 {saving ? "Saving..." : "Save Changes"}
//               </Button>

//               <Button
//                 variant="secondary"
//                 type="button"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </Button>
//             </div>

//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/lib/api";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";

// import { setUser } from "@/redux/features/authSlice";  // ✅ FIXED import

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";

// export default function SettingsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { toast } = useToast();
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     address: "",
//     avatar: "",
//   });

//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Load profile data
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/auth/me");
//         const data = res.data.user;

//         setForm({
//           username: data.username || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           address: data.address || "",
//           avatar: data.avatar || "",
//         });
//       } catch (err) {
//         console.error("Failed to load profile", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Avatar upload
//   async function handleAvatarUpload() {
//     if (!avatarFile) return form.avatar;

//     const formData = new FormData();
//     formData.append("image", avatarFile);

//     try {
//       const res = await api.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res.data.url;
//     } catch (err) {
//       console.error("Avatar upload failed", err);
//       return form.avatar;
//     }
//   }

//   // Save profile
//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let avatarUrl = form.avatar;

//       if (avatarFile) {
//         avatarUrl = await handleAvatarUpload();
//       }

//       const payload = {
//         username: form.username,
//         email: form.email,
//         phone: form.phone,
//         address: form.address,
//         avatar: avatarUrl,
//       };

//       const res = await api.put("/auth/profile", payload);

//       // ✅ FIXED — correct Redux update
//       dispatch(setUser(res.data.user));

//       toast({
//         title: "Profile Updated 🎉",
//         description: "Your changes have been saved successfully.",
//       });

//     } catch (err: any) {
//       toast({
//         title: "Update Failed",
//         description: err.response?.data?.error || "Something went wrong.",
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading)
//     return <div className="p-10 text-center text-gray-500">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10">
//       <Card className="border border-gray-300 dark:border-gray-700">
//         <CardContent className="p-6">
//           <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

//           <form onSubmit={handleSave} className="space-y-6">

//             {/* Avatar */}
//             <div className="flex items-center gap-6">
//               <Avatar className="h-20 w-20 border">
//                 {form.avatar ? (
//                   <AvatarImage src={form.avatar} />
//                 ) : (
//                   <AvatarFallback>
//                     {form.username.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 )}
//               </Avatar>

//               <div className="flex-1">
//                 <Label>Profile Picture</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0] || null;
//                     if (file) {
//                       setAvatarFile(file);
//                       setForm({ ...form, avatar: URL.createObjectURL(file) });
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Username */}
//             <div>
//               <Label>Username</Label>
//               <Input
//                 value={form.username}
//                 onChange={(e) =>
//                   setForm({ ...form, username: e.target.value })
//                 }
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <Label>Email</Label>
//               <Input
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <Label>Phone</Label>
//               <Input
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm({ ...form, phone: e.target.value })
//                 }
//                 placeholder="e.g. +92 300 1234567"
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <Label>Address</Label>
//               <Input
//                 value={form.address}
//                 onChange={(e) =>
//                   setForm({ ...form, address: e.target.value })
//                 }
//                 placeholder="Enter your address"
//               />
//             </div>

//             <div className="flex gap-4">
//               <Button disabled={saving} type="submit">
//                 {saving ? "Saving..." : "Save Changes"}
//               </Button>

//               <Button
//                 variant="secondary"
//                 type="button"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </Button>
//             </div>

//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { setUser } from "@/redux/features/authSlice";

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

  console.log("🔄 Component Rendered — Toast Hook:", toast);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile
  useEffect(() => {
    (async () => {
      try {
        console.log("📡 Fetching /auth/me ...");
        const res = await api.get("/auth/me");
        const data = res.data.user;
        console.log("📥 Loaded profile:", data);

        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error("❌ Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Avatar upload
  async function handleAvatarUpload() {
    if (!avatarFile) return form.avatar;

    console.log("⬆ Uploading avatar file:", avatarFile);

    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("📸 Uploaded avatar URL:", res.data.url);
      return res.data.url;
    } catch (err) {
      console.error("❌ Avatar upload failed", err);
      return form.avatar;
    }
  }

  // Save Profile
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    console.log("💾 Save button clicked");

    try {
      let avatarUrl = form.avatar;

      if (avatarFile) {
        avatarUrl = await handleAvatarUpload();
      }

      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
        avatar: avatarUrl,
      };

      console.log("📤 Sending profile update payload:", payload);

      const res = await api.put("/auth/profile", payload);

      console.log("✅ Profile updated successfully:", res.data.user);

      dispatch(setUser(res.data.user));

      console.log("🔥 Calling toast() now...");
      toast({
        title: "Profile Updated 🎉",
        description: "Your changes have been saved successfully.",
      });
      console.log("🔥 toast() executed");
    } catch (err: any) {
      console.log("❌ Error caught in save handler:", err.response?.data || err);

      toast({
        title: "Update Failed",
        description: err.response?.data?.error || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="border border-gray-300 dark:border-gray-700">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border">
                {form.avatar ? (
                  <AvatarImage src={form.avatar} />
                ) : (
                  <AvatarFallback>
                    {form.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1">
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    console.log("📁 Selected avatar file:", file);
                    if (file) {
                      setAvatarFile(file);
                      setForm({ ...form, avatar: URL.createObjectURL(file) });
                    }
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="e.g. +92 300 1234567"
              />
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="Enter your address"
              />
            </div>

            <div className="flex gap-4">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

