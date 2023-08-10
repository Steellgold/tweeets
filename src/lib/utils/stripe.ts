import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15"
});

export const checkSubscriptionStatus = async(subscriptionId: string): Promise<boolean> => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId).catch(() => {
      return null;
    });

    if (!subscription) return false;

    const latestInvoice = subscription.latest_invoice;
    if (latestInvoice) {
      const invoice = await stripe.invoices.retrieve(latestInvoice.toString());
      if (invoice.status === "paid") return true;

      const currentDate = new Date();
      const invoiceDate = new Date(invoice.created * 1000);
      const daysDifference = (currentDate.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24);
      if (daysDifference > 2) return false;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};