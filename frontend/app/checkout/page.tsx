"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/features/cartSlice";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Truck,
  Check,
  Package,
  Lock,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  setAddressId,
  setSelectedShippingId,
  setPricing,
} from "@/redux/features/checkoutSlice";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
type Step = "shipping" | "payment" | "review";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
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
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const items = useSelector((state: RootState) => state.cart.items);

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  // const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutKey, setCheckoutKey] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const addressId = useSelector((state: RootState) => state.checkout.addressId);

  const selectedShippingId = useSelector(
    (state: RootState) => state.checkout.selectedShippingId,
  );

  const pricing = useSelector((state: RootState) => state.checkout.pricing);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const resetPaymentCheckout = () => {
  setCheckoutKey(null);
  setClientSecret(null);
  setOrderId(null);
};

  const subtotal = pricing.subtotal;
  const shippingCost = pricing.shipping;
  const tax = pricing.tax;
  const total = pricing.total;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [isAuthenticated, items.length, router]);
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchAddresses();
  }, [isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);

      const response = await api.get("/addresses");

      setAddresses(response.data.addresses || []);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      toast.error(
        error.response?.data?.error || "Failed to load saved addresses",
      );
    } finally {
      setAddressesLoading(false);
    }
  };
  const validateCheckout = async (
    addressIdValue: string,
    shippingMethodIdValue: string,
    token: string,
  ) => {
    const validateRes = await fetch(
      "http://localhost:5000/api/v1/checkout/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: addressIdValue,
          shippingMethodId: shippingMethodIdValue,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      },
    );

    if (!validateRes.ok) {
      const errorText = await validateRes.text();
      console.log("Checkout validation error:", errorText);
      throw new Error("Checkout validation failed");
    }

    const pricingData = await validateRes.json();

    dispatch(
      setPricing({
        subtotal: pricingData.subtotal,
        shipping: pricingData.shipping,
        tax: pricingData.tax,
        total: pricingData.total,
      }),
    );
  };
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addressId && selectedShippingId && shippingMethods.length > 0) {
      setCurrentStep("payment");
      return;
    }

    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zipCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // 1️⃣ Save Address
      const addressRes = await api.post("/addresses", {
        fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        phone: shippingInfo.phone,
        country: shippingInfo.country,
        state: shippingInfo.state,
        city: shippingInfo.city,
        postalCode: shippingInfo.zipCode,
        addressLine1: shippingInfo.address,
        isDefault: true,
      });

      const addressData = addressRes.data;
      const createdAddressId = addressData.address._id;
      dispatch(setAddressId(createdAddressId));

      // 2️⃣ Fetch Shipping Methods
      const shippingRes = await api.post("/shipping/methods", {
        country: shippingInfo.country,
        subtotal: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      });

      const shippingData = shippingRes.data;
      setShippingMethods(shippingData.methods);

      const selectedMethodId = shippingData.methods[0]?._id;

      // 3️⃣ Validate Checkout (VERY IMPORTANT)
      // 3️⃣ Validate Checkout
      if (!selectedMethodId) {
        toast.error("No shipping method available");
        return;
      }
      dispatch(setSelectedShippingId(selectedMethodId));

      const validateRes = await api.post("/checkout/validate", {
        addressId: createdAddressId,
        shippingMethodId: selectedMethodId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const pricingData = validateRes.data;

      dispatch(
        setPricing({
          subtotal: pricingData.subtotal,
          shipping: pricingData.shipping,
          tax: pricingData.tax,
          total: pricingData.total,
        }),
      );
    } catch (err: any) {
      console.log(err.response?.data);

      toast.error(err.response?.data?.error || "Failed to process shipping");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processing) return;

    if (!addressId || !selectedShippingId) {
      toast.error("Missing shipping information");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {
      const key = checkoutKey ?? crypto.randomUUID();
      setCheckoutKey(key);

      const response = await api.post(
        "/orders/create-payment-intent",
        {
          addressId,
          shippingMethodId: selectedShippingId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            "Idempotency-Key": key,
          },
        },
      );

      setOrderId(response.data.orderId);

      if (response.data.alreadyPaid) {
        dispatch(clearCart());
        toast.success("This order has already been paid.");
        router.push("/order-success");
        return;
      }
      if (response.data.paymentPendingConfirmation) {
  toast.info("Payment received. Confirming your order...");

  await handlePaymentSuccess(response.data.orderId);
  return;
}

      setClientSecret(response.data.clientSecret);
      setCurrentStep("review");
    } catch (err: any) {
      console.error("Payment initialization error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error ||
          "Unable to initialize payment. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (  paymentOrderId: string | null = orderId,
) => {
    if (!paymentOrderId) {
  toast.error("Order information is missing.");
  return;
}

    const maxAttempts = 5;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await api.get(`/orders/${paymentOrderId}/payment-status`);

        if (response.data.paid) {
          dispatch(clearCart());
          toast.success("Payment confirmed! Your order is placed.");
          router.push("/order-success");
          return;
        }

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      toast.info(
        "Your payment was submitted, but confirmation is delayed. Please check your order status shortly.",
      );
    } catch (error: any) {
      console.error(
        "Payment confirmation error:",
        error.response?.data || error,
      );

      toast.error(
        "We couldn't verify your order yet. Please don't submit another payment. Check your order status shortly.",
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "card") {
      toast.error("Please complete your card payment using Stripe.");
      return;
    }

    if (!addressId || !selectedShippingId) {
      toast.error("Missing shipping information");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {
      await api.post("/orders", {
        addressId,
        shippingMethodId: selectedShippingId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push("/order-success");
    } catch (err: any) {
      console.error("Order creation failed:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Order Failed");
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href="/cart"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Cart
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white">Checkout</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    index <= currentStepIndex
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  <step.icon size={18} />
                  <span className="font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStepIndex
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Information
                  </h2>
                  {/* Saved Address Selector */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">
                        Shipping Address
                      </Label>

                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-blue-600"
                        onClick={() => {
                           resetPaymentCheckout();
                          setShowNewAddressForm(true);
                          dispatch(setAddressId(null));
                          setShippingMethods([]);
                          dispatch(setSelectedShippingId(null));
                          dispatch(
                            setPricing({
                              subtotal: 0,
                              shipping: 0,
                              tax: 0,
                              total: 0,
                            }),
                          );
                        }}
                      >
                        + Add New Address
                      </Button>
                    </div>

                    {addressesLoading ? (
                      <div className="border rounded-xl p-4 text-sm text-gray-500">
                        Loading saved addresses...
                      </div>
                    ) : addresses.length > 0 ? (
                      <Select
                        value={addressId ?? ""}
                        onValueChange={async (value) => {
                          const selectedAddress = addresses.find(
                            (address) => address._id === value,
                          );

                          if (!selectedAddress) return;
                          resetPaymentCheckout();

                          dispatch(setAddressId(selectedAddress._id));

                          const nameParts = selectedAddress.fullName
                            .trim()
                            .split(" ");

                          setShippingInfo({
                            firstName: nameParts[0] || "",
                            lastName: nameParts.slice(1).join(" ") || "",
                            email: user?.email || "",
                            phone: selectedAddress.phone || "",
                            address: selectedAddress.addressLine1 || "",
                            city: selectedAddress.city || "",
                            state: selectedAddress.state || "",
                            zipCode: selectedAddress.postalCode || "",
                            country: selectedAddress.country || "",
                          });

                          setShippingMethods([]);
                          dispatch(setSelectedShippingId(null));

                          try {
                            // 1. Get shipping methods for selected address
                            const shippingRes = await api.post(
                              "/shipping/methods",
                              {
                                country: selectedAddress.country,
                                subtotal: items.reduce(
                                  (sum, item) =>
                                    sum + item.price * item.quantity,
                                  0,
                                ),
                              },
                            );

                            const methods = shippingRes.data.methods || [];

                            setShippingMethods(methods);

                            const selectedMethodId = methods[0]?._id;

                            if (!selectedMethodId) {
                              toast.error("No shipping method available");
                              return;
                            }

                            dispatch(setSelectedShippingId(selectedMethodId));

                            // 2. Validate checkout and calculate totals
                            const validateRes = await api.post(
                              "/checkout/validate",
                              {
                                addressId: selectedAddress._id,
                                shippingMethodId: selectedMethodId,
                                items: items.map((item) => ({
                                  productId: item.productId,
                                  quantity: item.quantity,
                                })),
                              },
                            );

                            const pricingData = validateRes.data;

                            dispatch(
                              setPricing({
                                subtotal: pricingData.subtotal,
                                shipping: pricingData.shipping,
                                tax: pricingData.tax,
                                total: pricingData.total,
                              }),
                            );
                          } catch (error: any) {
                            console.error(
                              "Saved address checkout error:",
                              error,
                            );

                            toast.error(
                              error.response?.data?.error ||
                                "Failed to calculate shipping and tax",
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-14 rounded-xl">
                          <SelectValue placeholder="Select a saved address" />
                        </SelectTrigger>

                        <SelectContent>
                          {addresses.map((address) => (
                            <SelectItem key={address._id} value={address._id}>
                              {address.fullName}
                              {address.isDefault ? " — Default" : ""}
                              {" — "}
                              {address.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="border border-dashed rounded-xl p-4 text-sm text-gray-500">
                        No saved addresses. Add a new address below.
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative mt-1">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              firstName: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative mt-1">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              lastName: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative mt-1">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              email: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative mt-1">
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              phone: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <div className="relative mt-1">
                        <Home
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              address: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <div className="relative mt-1">
                        <Building
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            country: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Truck size={20} />
                    Shipping Method
                  </h2>

                  <RadioGroup
                    value={selectedShippingId ?? ""}
                    onValueChange={async (value) => {
                      resetPaymentCheckout();
                      dispatch(setSelectedShippingId(value));

                      if (!addressId) {
                        return;
                      }

                      try {
                        const token = localStorage.getItem("token");

                        if (!token) {
                          toast.error("Please log in again");
                          return;
                        }

                        await validateCheckout(addressId, value, token);
                      } catch (error) {
                        toast.error("Failed to update shipping price");
                      }
                    }}
                  >
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label
                          key={method._id}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${
                            selectedShippingId === method._id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={method._id}
                              id={method._id}
                            />

                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {method.name}
                              </p>

                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {method.estimatedDays}
                              </p>
                            </div>
                          </div>

                          <span className="font-medium text-gray-900 dark:text-white">
                            {method.price === 0
                              ? "Free"
                              : formatPrice(method.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Link href="/cart">
                    <Button variant="outline" type="button">
                      <ChevronLeft size={18} className="mr-2" />
                      Back to Cart
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Payment
                    <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-3">
                      <label
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${paymentMethod === "card" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="card" id="card" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Credit / Debit Card
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Visa, Mastercard, Amex
                            </p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-gray-400" />
                      </label>
                      <label
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${paymentMethod === "paypal" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              PayPal
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Pay with your PayPal account
                            </p>
                          </div>
                        </div>
                      </label>
                      <label
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Cash on Delivery
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Pay when you receive
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    Back to Shipping
                  </Button>

                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={processing}
                  >
                    {processing ? "Preparing payment..." : "Review Order"}
                    {!processing && <ChevronRight size={18} className="ml-2" />}
                  </Button>
                </div>
              </form>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="space-y-6">
                {/* Shipping Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin size={20} />
                      Shipping Address
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                    <br />
                    {shippingInfo.address}
                    <br />
                    {shippingInfo.city}, {shippingInfo.state}{" "}
                    {shippingInfo.zipCode}
                    <br />
                    {shippingInfo.country}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment Method
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("payment")}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {paymentMethod === "card" && "Credit / Debit Card"}
                    {paymentMethod === "paypal" && "PayPal"}
                    {paymentMethod === "cod" && "Cash on Delivery"}
                  </p>
                </div>

                {paymentMethod === "card" && clientSecret && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Secure Card Payment
                    </h2>

                    <Elements
                      key={clientSecret}
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <StripePaymentForm
                        onPaymentSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Order Items
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4"
                      >
                        <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setCurrentStep("payment")}
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    Back to Payment
                  </Button>

                  {paymentMethod !== "card" && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handlePlaceOrder}
                      disabled={processing}
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-2.647-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Lock size={18} className="mr-2" />
                          Place Order - {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Items Preview */}
              <div className="space-y-3 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Lock size={16} />
                  <span>Your payment information is secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
