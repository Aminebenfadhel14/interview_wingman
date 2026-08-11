"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PricingCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="flex flex-col items-center py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
              <XCircle className="h-10 w-10 text-warning" />
            </div>

            <h1 className="mb-2 text-2xl font-bold">Checkout cancelled</h1>
            <p className="mb-8 max-w-sm text-muted">
              No worries — your payment wasn&apos;t processed. When you&apos;re
              ready to prepare, come back and pick a plan.
            </p>

            <div className="flex w-full flex-col gap-3 px-6">
              <Link href="/pricing" className="w-full">
                <Button size="lg" className="w-full">
                  Back to Pricing
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="secondary" size="lg" className="w-full group">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
