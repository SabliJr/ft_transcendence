import { Request, Response } from "express";
import stripe from "../config/payment";
import Stripe from "stripe";
import { WEBHOOK_SIGNING_SECRET } from "../constants/index";
import { query } from "../config/dbConfig";
import { verifyUser } from "../util/verificationFunctions";

const CLIENT_URL =
  process.env?.NODE_ENV === "production"
    ? "https://chatfolderz.com"
    : "http://localhost:3000";

const onCheckOut = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });
  }

  const { price_id } = req.query;
  try {
    let userInfo = await query("SELECT * FROM user_profile WHERE user_id=$1", [
      userId,
    ]);

    let { email } = userInfo?.rows[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id as string, // Price ID for either monthly or yearly plan
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      subscription_data: {
        trial_period_days: 1, // This will give the user a 1-day free trial
      },
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).send({
      error: error.message,
      message: "There was an error creating the subscription",
    });
  }
};

const onCheckOutOneTime = async (req: Request, res: Response) => {
  const userId = await verifyUser(req, res);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Invalid user ID or token.",
    });
  }

  const { price_id } = req.query;
  try {
    // Ensure the user has a Stripe customer ID
    let userInfo = await query("SELECT * FROM user_profile WHERE user_id=$1", [
      userId,
    ]);

    let { email } = userInfo?.rows[0];
    let customer = await stripe.customers.create({
      email: email,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id as string, // Price ID for the one-time purchase
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: customer.id,
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).send({
      error: error.message,
      message: "There was an error creating the one-time purchase",
    });
  }
};

const onSubscriptionSuccess = async (req: Request, res: Response) => {
  if (!req?.query.session_id)
    return res.status(401).json({ message: "Payment did not go through" });

  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id as string
  );

  if (session.payment_status === "paid" && session.status === "complete") {
    res.status(200).json({
      message: "Subscription successful, thanks!",
      user: {
        user_has_payed: true,
      },
    });
  } else {
    console.error("There was a problem inserting user's infos");
    res.status(400).json({ message: "Payment did not go through" });
  }
};

const onStripeWebhooks = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).send("Stripe Signature is missing");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req?.rawBody as Buffer,
      sig,
      WEBHOOK_SIGNING_SECRET as string
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        {
          const checkoutSessionCompleted = event.data.object;
          // Handle successful payment intent

          let customer_id = checkoutSessionCompleted.customer;
          let customer_email = checkoutSessionCompleted.customer_details?.email;
          let customer_country =
            checkoutSessionCompleted.customer_details?.address?.country;
          let customer_name = checkoutSessionCompleted.customer_details?.name;
          let created_at = new Date(checkoutSessionCompleted.created * 1000);
          let subscription_duration = "forever";
          let start_date = new Date(checkoutSessionCompleted.created * 1000);
          let subscription_status = "active";

          let isCustomerHasAccount = await query(
            "SELECT * FROM user_profile WHERE email=$1",
            [customer_email]
          );
          let { user_id } = isCustomerHasAccount?.rows[0];

          // Use INSERT ... ON CONFLICT to handle duplicate customer_id
          await query(
            `INSERT INTO user_subscription (
            customer_id, 
            customer_email, 
            user_id, 
            customer_country, 
            customer_name, 
            created_at, 
            subscription_duration, 
            updated_at, 
            last_subscription_start_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8)
            ON CONFLICT (user_id, customer_id)
            DO UPDATE SET
            customer_email = EXCLUDED.customer_email,
            user_id = EXCLUDED.user_id,
            customer_country = EXCLUDED.customer_country,
            customer_name = EXCLUDED.customer_name,
            updated_at = CURRENT_TIMESTAMP,
            created_at = EXCLUDED.created_at,
            subscription_duration = EXCLUDED.subscription_duration,
            last_subscription_start_date = EXCLUDED.last_subscription_start_date
            `,
            [
              customer_id,
              customer_email,
              user_id,
              customer_country,
              customer_name,
              created_at,
              subscription_duration,
              start_date,
            ]
          );

          await query(
            "UPDATE user_profile SET subscription_state=$1, plan_type=$2, has_access=$3, customer_id=$4 WHERE user_id=$5",
            [subscription_status, "onetime", true, customer_id, user_id]
          );
        }
        break;
      case "invoice.payment_succeeded":
        {
          const invoicePaymentSucceeded = event.data.object;
          const customerId = invoicePaymentSucceeded.customer;
          const subscriptionId = invoicePaymentSucceeded.subscription;

          // Fetch the subscription details using the subscription ID
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId as string
          );

          const subscriptionStatus = subscription.status; // e.g., 'active'
          const expiresAt = new Date(subscription.current_period_end * 1000); // Subscription end date
          const startDate = new Date(subscription.start_date * 1000); // Subscription start date
          const plan = subscription.items.data[0].plan;
          const subscription_duration = plan.interval;

          // Update the user profile with the new subscription state
          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
            [subscriptionStatus, expiresAt, true, customerId]
          );

          // Update subscription information in user_subscription table
          await query(
            `UPDATE user_subscription 
            SET subscription_duration=$1, updated_at=CURRENT_TIMESTAMP, last_subscription_start_date=$2 
            WHERE customer_id=$3`,
            [subscription_duration, startDate, customerId]
          );
        }
        break;
      case "customer.subscription.deleted": // When a subscription ends
        {
          const customerSubscriptionDeleted = event.data
            .object as Stripe.Subscription;
          const customerId = customerSubscriptionDeleted.customer;
          const expiresAt = new Date(
            customerSubscriptionDeleted.current_period_end * 1000 // This is the subscription end date
          );
          const subscriptionState = customerSubscriptionDeleted.status;
          const currentPeriodStartDate = new Date(
            customerSubscriptionDeleted.start_date * 1000 // This is the current subscription period start date
          );

          // Update the database to reflect the subscription cancellation
          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
            [subscriptionState, expiresAt, false, customerId]
          );

          // Update the subscription state to 'canceled' and set updated_at to the current time
          await query(
            "UPDATE user_subscription SET updated_at=CURRENT_TIMESTAMP, last_subscription_start_date=$2 WHERE customer_id=$1",
            [customerId, currentPeriodStartDate]
          );
        }
        break;
      case "customer.subscription.created":
        {
          const subscriptionCreated = event.data.object as Stripe.Subscription;
          const customer_id = subscriptionCreated.customer;
          const subscriptionStatus = subscriptionCreated.status; // e.g., 'trialing', 'active'
          const expiresAt = new Date(
            subscriptionCreated.current_period_end * 1000
          ); // Subscription end date
          const created_at = new Date(subscriptionCreated.created * 1000); // Subscription creation date
          const startDate = new Date(subscriptionCreated.start_date * 1000); // Subscription start date
          const plan = subscriptionCreated.items.data[0].plan; // Get the plan details
          const subscription_duration = plan.interval;

          // Retrieve customer details
          const customer = await stripe.customers.retrieve(
            customer_id as string
          );
          const customer_email = (customer as Stripe.Customer).email as string;
          let customer_name = (customer as Stripe.Customer).name;
          let customer_country = (customer as Stripe.Customer).address?.country;

          let isCustomerHasAccount = await query(
            "SELECT * FROM user_profile WHERE email=$1",
            [customer_email]
          );
          let { user_id } = isCustomerHasAccount?.rows[0];

          // Use INSERT ... ON CONFLICT to handle duplicate customer_id
          await query(
            `INSERT INTO user_subscription (
            customer_id, 
            customer_email, 
            user_id, 
            customer_country, 
            customer_name, 
            created_at, 
            subscription_duration, 
            updated_at, 
            last_subscription_start_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8)
            ON CONFLICT (customer_id)
            DO UPDATE SET
            customer_email = EXCLUDED.customer_email,
            user_id = EXCLUDED.user_id,
            customer_country = EXCLUDED.customer_country,
            customer_name = EXCLUDED.customer_name,
            updated_at = CURRENT_TIMESTAMP,
            created_at = EXCLUDED.created_at,
            subscription_duration = EXCLUDED.subscription_duration,
            last_subscription_start_date = EXCLUDED.last_subscription_start_date
            `,
            [
              customer_id,
              customer_email,
              user_id,
              customer_country,
              customer_name,
              created_at,
              subscription_duration,
              startDate,
            ]
          );

          await query(
            "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3, customer_id=$4 WHERE user_id=$5",
            [subscriptionStatus, expiresAt, true, customer_id, user_id]
          );
        }
        break;
      case "customer.subscription.updated":
        const customerSubscriptionUpdated = event.data.object;
        const updatedCustomerId = customerSubscriptionUpdated.customer;
        const subscriptionStatus = customerSubscriptionUpdated.status; // e.g., 'active', 'past_due', etc.
        const expiresAt = new Date(
          customerSubscriptionUpdated.current_period_end * 1000
        );

        // Update the subscription state and expires_at based on the new status
        const now = new Date();
        let has_access = expiresAt > now ? true : false;
        await query(
          "UPDATE user_profile SET subscription_state=$1, expires_at=$2, has_access=$3 WHERE customer_id=$4",
          [subscriptionStatus, expiresAt, has_access, updatedCustomerId]
        );

        await query(
          "UPDATE user_subscription SET updated_at=CURRENT_TIMESTAMP WHERE customer_id=$1",
          [updatedCustomerId]
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send("Webhook received!");
  } catch (err: any) {
    console.error("There was an error catching payment events: ", err);
    res.status(400).send(`Webhook Error: ${err?.message}`);
  }
};

async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  return subscriptions.data; // This will return an array of subscription objects
}

const onCancelSubscription = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken || !cookies.userId) return res.sendStatus(401);

  const userId = cookies.userId;
  let { customer_id } = req.query;

  try {
    let subscriptions = await getCustomerSubscriptions(customer_id as string);
    let { expires_at } = (
      await query("SELECT * FROM user_profile WHERE user_id=$1", [userId])
    ).rows[0];

    // Cancel the subscription immediately
    // const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

    // Ensure subscriptions is an array and get the first subscription ID
    if (Array.isArray(subscriptions) && subscriptions.length > 0) {
      let subscriptionId = subscriptions[0].id;

      // Cancel the subscription immediately
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      let updateUserProfile = await query(
        "UPDATE user_profile SET is_canceled=$1 WHERE user_id=$2 AND customer_id=$3 RETURNING *",
        [true, userId, customer_id]
      );

      let { is_canceled } = updateUserProfile.rows[0];

      res.status(200).json({
        message: "Subscription canceled successfully",
        is_canceled: is_canceled,
        accessTime: expires_at,
      });
    } else {
      res.status(404).json({ message: "No subscriptions found" });
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      message:
        "An error occurred while canceling the subscription. Please try again or contact support if the issue persists.",
    });
  }
};

export {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
  onCancelSubscription,
  onCheckOutOneTime,
};
