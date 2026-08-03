"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import {
  Check,
  Zap,
  ArrowRight,
  Mic,
  FileText,
  BarChart3,
  Download,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "One-Time",
    price: "$14.99",
    period: "one session",
    description: "Perfect for a single interview prep",
    features: [
      "1 complete interview prep session",
      "Full gap analysis",
      "7 practice questions with feedback",
      "Voice scoring",
      "Cheat sheet PDF",
      "Download & share",
    ],
    cta: "Get Started",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Unlimited",
    price: "$29",
    period: "/month",
    description: "For active job seekers",
    features: [
      "Unlimited interview sessions",
      "Full gap analysis",
      "7 practice questions per session",
      "Voice scoring with AI feedback",
      "Cheat sheet PDFs",
      "Save all sessions",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <Star className="h-3.5 w-3.5" />
            Simple Pricing
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Prepare like a pro.
            <br />
            Walk in with a cheat sheet.
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg text-muted">
            No hidden fees. No surprises. Just interview prep that actually works.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
            >
              <Card
                className={`relative flex h-full flex-col ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted">/{plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{plan.description}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} className="w-full group" size="lg">
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted">
            7-day free trial on Unlimited plan. Cancel anytime. No commitment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-20 grid max-w-3xl gap-8 md:grid-cols-3"
        >
          {[
            { icon: FileText, title: "Personalized", desc: "Based on YOUR resume and the specific job" },
            { icon: Mic, title: "Interactive", desc: "Record answers, get real-time AI feedback" },
            { icon: Download, title: "Actionable", desc: "Walk away with a printable cheat sheet" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h4 className="mb-1 font-bold">{item.title}</h4>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
