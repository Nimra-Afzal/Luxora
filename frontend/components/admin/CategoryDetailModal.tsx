"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  FolderOpen,
  Calendar,
  Hash,
  FileText,
  Layers,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  status?: string;
  displayOrder?: number;
  parent?: {
    _id: string;
    name: string;
    slug?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  subcategoriesCount?: number;
}

export default function CategoryDetailModal({
  open,
  onClose,
  category,
  subcategoriesCount = 0,
}: Props) {
  if (!category) return null;

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

  const isParentCategory = !category.parent || category.parent._id === category._id;
  const status = category.status || "active";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Category Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Icon & Title */}
          <div className="flex items-start gap-4">
            <div
              className={`p-4 rounded-xl ${
                isParentCategory
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {isParentCategory ? (
                <FolderOpen
                  size={32}
                  className="text-blue-600 dark:text-blue-400"
                />
              ) : (
                <Folder size={32} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.name}
                </h2>
                <Badge
                  variant={status === "active" ? "default" : "secondary"}
                  className={
                    status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {status}
                </Badge>
              </div>

              {category.slug && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  /{category.slug}
                </p>
              )}

              <div className="mt-2">
                {isParentCategory ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <Layers size={14} />
                    Parent Category
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <Folder size={14} />
                    Subcategory of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.parent?.name}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {category.description && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                <FileText size={14} />
                <span className="text-xs font-medium uppercase">Description</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {category.description}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {isParentCategory && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                  <Folder size={16} />
                  <span className="text-xs font-medium uppercase">Subcategories</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subcategoriesCount}
                </p>
              </div>
            )}

            <div
              className={`bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 ${
                !isParentCategory ? "col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Hash size={16} />
                <span className="text-xs font-medium uppercase">Display Order</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {category.displayOrder ?? 0}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Timeline
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Created
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(category.createdAt)}
              </dd>
              <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Last Updated
              </dt>
              <dd className="text-gray-900 dark:text-white">
                {formatDate(category.updatedAt)}
              </dd>
            </dl>
          </div>

          {/* Category ID */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">ID:</span> {category._id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
