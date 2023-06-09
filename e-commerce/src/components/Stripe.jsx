import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styling/Stripe.css'

// AT THE moment it works, it will need to make all the other changes to the database, like the cat has been bought. Will need to send a message to the owner
// Will need to finish doing the gradual change upon the pay button pressed


const StripePaymentForm = ({message, handleQuit}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()
  


  // after I have added the DB changing func, for messages and cats_for_sale, it started crashing 
  // GET http://localhost:3000/messages/10 net::ERR_CONNECTION_REFUSED

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

   
    
    const cardElement = elements.getElement(CardElement);

    // Make an API call to your server to create a PaymentIntent or Charge object with the desired amount
    const response = await fetch('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: message.asked_price * 100, 
        cat_id: message.cat_id,
        cat_owner: message.sender_id, 
        buyer_id: message.receiver_id
      }),
    });

    const { clientSecret } = await response.json();

    // Confirm the payment on the client-side using the PaymentIntent client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setErrorMessage(error.message);
      console.log(error.message);
      return;
    }

    // Payment confirmed successfully
    console.log(paymentIntent);
    setErrorMessage('');
    navigate('/profile')

    // Process the payment or handle success/failure...

    // Rest of the code...
  };


  return (
    <div>
      
      <form className="stripe" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-element">Card Details</label>
          <CardElement id="card-element" className='card-element'/>
        </div>
        <button type="submit" disabled={!stripe}>
          Submit Payment
        </button>
        <button onClick={handleQuit}>Cancel</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default StripePaymentForm;