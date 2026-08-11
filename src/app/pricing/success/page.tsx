"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingSuccessPage() {
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10"
            >
              <CheckCircle2 className="h-10 w-10 text-secondary" />
            </motion.div>

            <h1 className="mb-2 text-2xl font-bold">You&apos;re all set!</h1>
            <p className="mb-8 max-w-sm text-muted">
              Your payment was successful. You can now start your interview prep
              session and get your personalized cheat sheet.
            </p>

            <div className="flex w-full flex-col gap-3 px-6">
              <Link href="/" className="w-full">
                <Button size="lg" className="w-full group">
                  Start Your Session
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button variant="secondary" size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
