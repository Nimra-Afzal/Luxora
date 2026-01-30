"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  createCategory,
  updateCategory,
  getAdminParentCategories,
} from "@/redux/features/categorySlice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Category {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  displayOrder?: number;
  parent?: {
    _id: string;
    name: string;
  } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
}

export default function CategoryFormModal({
  open,
  onClose,
  onSuccess,
  category,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { parents, parentsLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("none");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Fetch parent categories when modal opens
  useEffect(() => {
    if (open) {
      dispatch(getAdminParentCategories());
    }
  }, [open, dispatch]);

  // Prefill form in edit mode
  useEffect(() => {
    if (!open) return;

    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setParentId(category.parent?._id || "none");
      setStatus((category.status as "active" | "inactive") || "active");
      setDisplayOrder(category.displayOrder || 0);
    } else {
      // Reset form for create mode
      setName("");
      setDescription("");
      setParentId("none");
      setStatus("active");
      setDisplayOrder(0);
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = {
        name: name.trim(),
        description: description.trim(),
        parent: parentId === "none" ? null : parentId,
        status,
        displayOrder,
      };

      if (category) {
        await dispatch(
          updateCategory({ id: category._id, data: formData })
        ).unwrap();
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current category from parent options (can't be its own parent)
  const availableParents = parents.filter((p) => p._id !== category?._id);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shoes, Electronics"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <Label>Category Type</Label>
            <Select
              value={parentId}
              onValueChange={setParentId}
              disabled={parentsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  Parent Category (Top Level)
                </SelectItem>
                {availableParents.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    Subcategory of: {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {parentId && parentId !== "none"
                ? "This will be a subcategory under the selected parent"
                : "This will be a top-level parent category"}
            </p>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Lower numbers appear first in the list
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-gray-500">
                {status === "active"
                  ? "Category is visible to customers"
                  : "Category is hidden from customers"}
              </p>
            </div>
            <Switch
              checked={status === "active"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "active" : "inactive")
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : category
                ? "Update Category"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
