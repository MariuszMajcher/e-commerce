import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

const PaymentForm = () => {
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Failed to load Stripe');
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'PRICE_ID', quantity: 1 }],
      mode: 'payment',
      successUrl: 'https://localhost:3000/succes',
      cancelUrl: 'https://localhost:3000/failure',
    });

    if (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={{ style: { base: { fontSize: '16px' } } }}
          onChange={(e) => setCardComplete(e.complete)}
        />
      </label>

      <button type="submit" disabled={!cardComplete}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;