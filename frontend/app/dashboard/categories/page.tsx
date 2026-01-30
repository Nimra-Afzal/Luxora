"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getAdminCategories,
  deleteCategory,
} from "@/redux/features/categorySlice";
import {
  PlusCircle,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Folder,
  FolderOpen,
  ChevronRight,
  Package,
  Search,
  X,
  ChevronLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryFormModal from "@/components/CategoryFormModal";
import CategoryDetailModal from "@/components/admin/CategoryDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Category {
  _id: string;
  name: string;
  slug: string;
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

const ITEMS_PER_PAGE = 2;

export default function CategoriesListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { list: categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [viewingSubsCount, setViewingSubsCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAdminCategories());
  }, [dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await dispatch(deleteCategory(deleteId)).unwrap();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      setDeleteId(null);
      setDeleteError(null);
    } catch (err: any) {
      setDeleteError(err);
    }
  };

  // Organize categories into a hierarchical structure
  const parentCategories = (categories as Category[]).filter(
    (c) => !c.parent || c.parent === null || c.parent._id === c._id
  );
  const getSubcategories = (parentId: string) =>
    (categories as Category[]).filter(
      (c) => c.parent && c.parent._id === parentId && c._id !== parentId
    );

  // Filter categories
  const filteredParentCategories = useMemo(() => {
    return parentCategories.filter((parent) => {
      const subs = getSubcategories(parent._id);

      // Search filter - check parent and its subcategories
      const parentMatches = parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const subsMatch = subs.some(
        (sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesSearch = searchQuery === "" || parentMatches || subsMatch;

      // Status filter
      const parentStatusMatches = statusFilter === "all" ||
        (parent.status || "active") === statusFilter;
      const subsStatusMatch = subs.some(
        (sub) => (sub.status || "active") === statusFilter
      );
      const matchesStatus = statusFilter === "all" || parentStatusMatches || subsStatusMatch;

      // Type filter
      let matchesType = true;
      if (typeFilter === "parent") {
        matchesType = true; // Always show parents when filtering for parents
      } else if (typeFilter === "subcategory") {
        matchesType = subs.length > 0; // Only show parents that have subcategories
      }

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [parentCategories, categories, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredParentCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredParentCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all";

  // Filter subcategories based on search
  const getFilteredSubcategories = (parentId: string) => {
    const subs = getSubcategories(parentId);
    if (!searchQuery && statusFilter === "all") return subs;

    return subs.filter((sub) => {
      const matchesSearch = searchQuery === "" ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (sub.status || "active") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product categories and subcategories (2-level hierarchy)
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCategory(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Category
        </Button>
      </header>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="parent">Parent Only</SelectItem>
              <SelectItem value="subcategory">With Subcategories</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X size={16} />
              Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Showing {paginatedCategories.length} of {filteredParentCategories.length} categories
            {hasActiveFilters && ` (filtered from ${parentCategories.length} total)`}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="ml-10 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredParentCategories.length === 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
          <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {hasActiveFilters ? "No Matching Categories" : "No Categories Yet"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {hasActiveFilters
              ? "No categories match your current filters."
              : "Create your first category to start organizing products."}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingCategory(null);
                setOpenModal(true);
              }}
            >
              <PlusCircle size={18} className="mr-2" />
              Create First Category
            </Button>
          )}
        </div>
      )}

      {/* Categories Hierarchy */}
      {!loading && paginatedCategories.length > 0 && (
        <div className="space-y-4">
          {paginatedCategories.map((parent) => {
            const subs = getFilteredSubcategories(parent._id);
            const allSubs = getSubcategories(parent._id);

            return (
              <div
                key={parent._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Parent Category Row */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <FolderOpen
                      size={20}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {parent.name}
                      </h3>
                      {parent.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {parent.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${
                        parent.status === "active" || !parent.status
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {parent.status || "active"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {allSubs.length} subcategories
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => {
                          setViewingCategory(parent);
                          setViewingSubsCount(allSubs.length);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCategory(parent);
                          setOpenModal(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteId(parent._id)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subcategories */}
                {subs.length > 0 && (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {subs.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight
                            size={14}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <Folder
                            size={16}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              {sub.name}
                            </span>
                            {sub.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {sub.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              sub.status === "active" || !sub.status
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {sub.status || "active"}
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => {
                                setViewingCategory(sub);
                                setViewingSubsCount(0);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye size={14} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCategory(sub);
                                setOpenModal(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Pencil size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(sub._id)}
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty subcategories message */}
                {allSubs.length === 0 && (
                  <div className="p-4 pl-12 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Package size={14} />
                    No subcategories yet.
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setOpenModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Add one
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryFormModal
        open={openModal}
        category={editingCategory}
        onClose={() => {
          setOpenModal(false);
          setEditingCategory(null);
        }}
        onSuccess={() => {
          setOpenModal(false);
          setEditingCategory(null);
          dispatch(getAdminCategories());
        }}
      />

      {/* Category Detail Modal */}
      <CategoryDetailModal
        open={!!viewingCategory}
        onClose={() => setViewingCategory(null)}
        category={viewingCategory}
        subcategoriesCount={viewingSubsCount}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => {
          setDeleteId(null);
          setDeleteError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <span className="text-red-600">{deleteError}</span>
              ) : (
                "This action cannot be undone. Make sure this category has no subcategories or products before deleting."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
