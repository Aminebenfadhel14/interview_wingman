import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlan, getStripePriceId, type PlanId } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function isMockMode() {
  const key = process.env.STRIPE_SECRET_KEY;
  return !key || !key.startsWith("sk_");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planId = (body?.planId || "one-time") as PlanId;
    const plan = getPlan(planId);

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const successUrl = `${appUrl}/pricing/success?plan=${plan.id}`;
    const cancelUrl = `${appUrl}/pricing`;

    if (isMockMode()) {
      return NextResponse.json({
        url: `${successUrl}&mock=1`,
        mock: true,
      });
    }

    const priceId = getStripePriceId(plan.id);
    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Missing Stripe price ID. Set STRIPE_ONE_TIME_PRICE_ID and STRIPE_UNLIMITED_PRICE_ID in .env.local",
        },
        { status: 500 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: plan.id === "unlimited" ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: plan.id,
      },
    };

    if (plan.id === "unlimited" && plan.trialDays) {
      sessionParams.subscription_data = {
        trial_period_days: plan.trialDays,
      };
    }

    if (body?.email) {
      sessionParams.customer_email = body.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url, mock: false });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
