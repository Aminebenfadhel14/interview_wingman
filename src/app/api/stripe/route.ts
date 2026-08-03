import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  try {
    const { priceType } = await request.json();

    const priceId =
      priceType === "subscription"
        ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID
        : process.env.STRIPE_ONE_TIME_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId || "price_placeholder",
          quantity: 1,
        },
      ],
      mode: priceType === "subscription" ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
