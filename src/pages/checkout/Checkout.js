import { Container, Typography, TextField, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFunctions } from "../../hooks/useFunctions";

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function Checkout() {
  const { user } = useAuthContext();
  const history = useHistory();
  const [clientSecret, setClientSecret] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [items, setItems] = useState(null);
  const [fullName, setFullName] = useState(user.name);
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const [messages, _setMessages] = useState("");
  const { callfunction } = useFunctions();
  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  const [paymentIntent, setPaymentIntent] = useState();
  const [errorPayement, setErrorPayement] = useState();

  // helper for displaying status messages.
  const setMessage = (message) => {
    _setMessages(`${messages}\n\n${message}`);
  };

  useEffect(() => {
    const state = history.location.state;

    setClientSecret(state.clientSecret);
    setTotalPrice(state.totalPrice);
    setItems(state.items);
  }, []);

  const handleSubmit = async () => {
    const cardElement = elements.getElement(CardElement);
    setLoadingPaiement(true);
    const { error: errorPayementMethod, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: user.name,
        },
      });

    if(errorPayementMethod){
      setErrorPayement(true);
      setLoadingPaiement(false);
      return;
    }


    const fingerPrint = await callfunction("getFingerprint", {
      paymentMethod: paymentMethod.id,
    });

    const userPaymentMethods = await callfunction("getPaymentsMethods", {
      customerId: user.customerId,
    });

    const duplicates = userPaymentMethods.data.filter(
      (pm) => pm.card.fingerprint === fingerPrint.card.fingerprint
    );
    let pmId;
    duplicates.length > 0
      ? (pmId = duplicates[0].id)
      : (pmId = paymentMethod.id);
    let { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: pmId,
        setup_future_usage: "off_session",
      }
    );
    setLoadingPaiement(false);
    if (error) {
      // show error and collect new card details.
      setMessage(error.message);
      setErrorPayement(true);
      return;
    }
    setPaymentIntent(paymentIntent);
  };
  if (paymentIntent && paymentIntent.status === "succeeded") {
    return <Redirect to={{ pathname: "/success" }} />;
  }

  return (
    <Container maxWidth="sm">
      {clientSecret && (
        <Box p={5} my={5} sx={{ border: 0, borderRadius: 2, boxShadow: 2 }}>
          <Box>
            {items.map((item) => (
              <Box
                key={item.productId}
                display="flex"
                justifyContent="space-between"
              >
                <Typography>{item.nom}</Typography>
                <Typography>{item.textPrix}</Typography>
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Prix total :</Typography>
            <Typography variant="h6">{totalPrice}€</Typography>
          </Box>
          <TextField
            fullWidth
            sx={{ marginY: 2 }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            size="small"
          />

          <CardElement options={CARD_ELEMENT_OPTIONS} />
          {loadingPaiement ? (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled
              onClick={handleSubmit}
              sx={{ marginTop: "20px", width: "100%" }}
            >
              Payer la commande
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              sx={{ marginTop: "20px", width: "100%" }}
            >
              Payer la commande
            </Button>
          )}
          {errorPayement && <Box><Typography color="error">Une erreur est survenue.</Typography></Box>}
        </Box>
      )}
    </Container>
  );
}
