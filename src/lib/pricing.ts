export type PlanId = "one-time" | "unlimited";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceAmount: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: "secondary" | "default";
  popular: boolean;
  trialDays?: number;
}

export const PLANS: Plan[] = [
  {
    id: "one-time",
    name: "One-Time",
    price: "$14.99",
    priceAmount: 1499,
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
    variant: "secondary",
    popular: false,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "$29",
    priceAmount: 2900,
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
    variant: "default",
    popular: true,
    trialDays: 7,
  },
];

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}

export function getStripePriceId(planId: PlanId): string | undefined {
  if (planId === "unlimited") {
    return process.env.STRIPE_UNLIMITED_PRICE_ID;
  }
  return process.env.STRIPE_ONE_TIME_PRICE_ID;
}
