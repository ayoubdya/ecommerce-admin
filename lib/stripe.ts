import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export default stripe;
