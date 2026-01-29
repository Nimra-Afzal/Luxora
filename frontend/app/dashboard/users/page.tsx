"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setUserFromStorage } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export default function AdminUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const { user } = useSelector((state: RootState) => state.auth);

  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [authChecked, setAuthChecked] = useState(false);

  // 🔐 Restore auth state FIRST
  useEffect(() => {
    dispatch(setUserFromStorage());
    setAuthChecked(true);
  }, [dispatch]);

  // 🔒 Role-based protection (AFTER auth restore)
  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.push("/login");
   } else if (user.role !== "admin") {
  toast({
    title: "Access denied",
    description: "Admins only",
    variant: "destructive",
  });

  setTimeout(() => {
    router.push("/dashboard");
  }, 3000);
}
  }, [authChecked, user, router]);

  // 📡 Fetch users (admin only)
  async function fetchUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast({
        title: "Access denied",
        description: "Admins only",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // ✏️ Update user role
  async function updateUserRole(id: string) {
    try {
      await api.put(`/users/${id}`, { role: editRole });
      toast({ title: "User updated successfully" });
      setEditingId(null);
      fetchUsers();
    } catch {
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    }
  }

  // 🗑 Delete user
  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast({ title: "User deleted" });
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  }

  if (!authChecked || !user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Users Management</h1>

      <div className="space-y-4">
        {users.map((u) => (
          <Card key={u._id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{u.username}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-sm">
                  Role: <b>{u.role}</b>
                </p>
              </div>

              <div className="flex gap-3">
                {editingId === u._id ? (
                  <>
                    <select
                      value={editRole}
                      onChange={(e) =>
                        setEditRole(e.target.value as "user" | "admin")
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>

                    <Button
                      size="sm"
                      onClick={() => updateUserRole(u._id)}
                    >
                      Save
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(u._id);
                        setEditRole(u.role);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
