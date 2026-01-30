"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Mail,
  Calendar,
  Hash,
  AtSign,
} from "lucide-react";

interface UserType {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
}

export default function UserDetailModal({ open, onClose, user }: Props) {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAdmin = user.role === "admin";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar & Info */}
          <div className="flex items-center gap-4">
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center ${
                isAdmin
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {isAdmin ? (
                <Shield size={32} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <User size={32} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h2>
                <Badge
                  variant={isAdmin ? "default" : "secondary"}
                  className={
                    isAdmin
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      : ""
                  }
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <Mail size={14} />
                {user.email}
              </p>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <AtSign size={16} />
                <span className="text-xs font-medium uppercase">Username</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.username}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 ${
                isAdmin
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-1 ${
                  isAdmin
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Shield size={16} />
                <span className="text-xs font-medium uppercase">Role</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
              <Mail size={16} />
              <span className="text-xs font-medium uppercase">Email Address</span>
            </div>
            <p className="text-gray-900 dark:text-white break-all">
              {user.email}
            </p>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Account Timeline
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Joined
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(user.createdAt)}
              </dd>
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Last Updated
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(user.updatedAt)}
              </dd>
            </dl>
          </div>

          {/* User ID */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Hash size={12} />
              <span className="font-medium">ID:</span> {user._id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
