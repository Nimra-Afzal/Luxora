
"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StripePaymentFormProps {
  onPaymentSuccess: () => void;
}

export default function StripePaymentForm({
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || processing) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onPaymentSuccess();
      } else if (paymentIntent?.status === "processing") {
        toast.info("Your payment is processing. Please wait for confirmation.");
      } else {
        toast.error("Payment has not been confirmed yet.");
      }
    } catch {
      toast.error("Unable to confirm payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full"
      >
        {processing ? "Processing payment..." : "Pay securely"}
      </Button>
    </form>
  );
}
