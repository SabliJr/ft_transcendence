import { Request, Response } from "express";
import stripe from "./config/payment";
import Stripe from "stripe";
import { WEBHOOK_SIGNING_SECRET } from "./constants/index";
import { query } from "./config/dbConfig";
import { verifyUser } from "./util/verificationFunctions";

const onCheckOutOneTimeWithTrial = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });
  }

  const { price_id } = req.query;
  console.log(`The price id is: ${price_id}`);

  try {
    // Ensure the user has a Stripe customer ID
    let userInfo = await query("SELECT * FROM user_profile WHERE user_id=$1", [
      userId,
    ]);

    let { email } = userInfo?.rows[0];
    let price: number = await calculateAmount(price_id as string);
    let customer = await stripe.customers.create({
      email: email,
    });

    // Create a PaymentIntent with manual capture mode
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      capture_method: "manual",
    });

    console.log(`Payment Intent created: ${paymentIntent.id}`);

    // Send back the checkout URL
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({
      error: error.message,
      message: "There was an error creating the checkout session",
    });
  }
};

// Function to calculate amount based on price_id
const calculateAmount = async (price_id: string): Promise<number> => {
  const get_price = await stripe.prices.retrieve(price_id);

  let price: number = get_price.unit_amount as number;
  return price;
};

// Function to capture the payment after confirming the intent
const capturePayment = async (paymentIntentId: string) => {
  try {
    const capturedPayment = await stripe.paymentIntents.capture(
      paymentIntentId
    );
    console.log(`Payment captured: ${capturedPayment.id}`);
    return capturedPayment;
  } catch (error) {
    console.error("Error capturing payment:", error);
    throw error;
  }
};
