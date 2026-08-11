"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { PlanId } from "@/lib/pricing";

interface CheckoutButtonProps extends Omit<ButtonProps, "onClick" | "asChild"> {
  planId: PlanId;
  email?: string;
  children: React.ReactNode;
}

export function CheckoutButton({
  planId,
  email,
  children,
  ...props
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not start checkout.");
        return;
      }

      router.push(data.url);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
