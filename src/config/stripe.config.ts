import Stripe from "stripe";
import { envVars } from "./config";

export const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);
