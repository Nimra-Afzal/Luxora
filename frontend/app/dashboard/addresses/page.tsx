"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  MapPin,
  X,
} from "lucide-react";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  isDefault: boolean;
}

interface AddressForm {
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
}

const emptyForm: AddressForm = {
  fullName: "",
  phone: "",
  country: "Pakistan",
  state: "",
  city: "",
  postalCode: "",
  addressLine1: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // ID of the address currently waiting for delete confirmation
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(
    null
  );

  // -----------------------------
  // Fetch addresses
  // -----------------------------
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/addresses");

      setAddresses(response.data.addresses || []);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);

      toast.error(
        error.response?.data?.error || "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // -----------------------------
  // Form helpers
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address._id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      country: address.country || "Pakistan",
      state: address.state || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
      addressLine1: address.addressLine1 || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // -----------------------------
  // Validate form
  // -----------------------------
  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!form.country.trim()) {
      toast.error("Country is required");
      return false;
    }

    if (!form.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!form.postalCode.trim()) {
      toast.error("Postal code is required");
      return false;
    }

    if (!form.addressLine1.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  // -----------------------------
  // Create / Update address
  // -----------------------------
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);

        toast.success("Address updated successfully");
      } else {
        await api.post("/addresses", {
          ...form,
          isDefault: addresses.length === 0,
        });

        toast.success("Address added successfully");
      }

      closeForm();
      await fetchAddresses();
    } catch (error: any) {
      console.error("Address save error:", error);

      toast.error(
        error.response?.data?.error ||
          "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete address
  // -----------------------------
  const handleDelete = async () => {
    if (!deleteAddressId) {
      return;
    }

    try {
      await api.delete(`/addresses/${deleteAddressId}`);

      toast.success("Address deleted successfully");

      // Close confirmation dialog
      setDeleteAddressId(null);

      // Refresh addresses
      await fetchAddresses();
    } catch (error: any) {
      console.error("Delete address error:", error);

      toast.error(
        error.response?.data?.error ||
          "Failed to delete address"
      );
    }
  };

  // -----------------------------
  // Set default address
  // -----------------------------
  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/addresses/${id}/default`);

      toast.success("Default address updated");

      await fetchAddresses();
    } catch (error: any) {
      console.error("Set default address error:", error);

      toast.error(
        error.response?.data?.error ||
          "Failed to update default address"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Addresses
              </h1>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your saved shipping addresses.
            </p>
          </div>

          {!showForm && (
            <Button
              onClick={openAddForm}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your shipping information below.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeForm}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name
                  </Label>

                  <Input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>

                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country
                  </Label>

                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Pakistan"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State / Province
                  </Label>

                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Punjab"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City
                  </Label>

                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Lahore"
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal Code
                  </Label>

                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="54000"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="addressLine1">
                  Address
                </Label>

                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading addresses...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <MapPin className="mx-auto mb-4 h-10 w-10 text-gray-400" />

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No saved addresses
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add an address to make checkout faster.
            </p>

            {!showForm && (
              <Button
                onClick={openAddForm}
                className="mt-5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Address
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`relative rounded-2xl border bg-white p-6 shadow-sm transition dark:bg-gray-900 ${
                  address.isDefault
                    ? "border-blue-500"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >

                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Star className="h-3 w-3 fill-current" />
                    Default
                  </div>
                )}

                {/* Address Details */}
                <div className="pr-20">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {address.fullName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {address.phone}
                  </p>
                </div>

                <div className="mt-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>{address.addressLine1}</p>

                  <p>
                    {address.city}
                    {address.state
                      ? `, ${address.state}`
                      : ""}
                  </p>

                  <p>
                    {address.postalCode},{" "}
                    {address.country}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5 dark:border-gray-800">

                  {/* Edit */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openEditForm(address)
                    }
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>

                  {/* Set Default */}
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSetDefault(address._id)
                      }
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Set Default
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDeleteAddressId(address._id)
                    }
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteAddressId}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteAddressId(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete this address?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete this address?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Address
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}