import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe(
  'pk_test_51S3DQU7fc8mH7MOghXlRxq8RG7EtkonvMWrDoaLei4JJaEog7hK1V3clyHgh2ymZkTeL3h0hhnIWTcfClnUWIHSH00fvd8TKSe'
); // Replace with your public key
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    const sessionData = session.data;

    if (session.status !== 200) throw new Error(sessionData.message);

    // 2) Create checkout form + charge customer
    const result = await stripe.redirectToCheckout({
      sessionId: sessionData.session.id,
    });

    if (result.error) {
      showAlert('error', result.error.message);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};
