import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useFunctions } from "../../../hooks/useFunctions";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { SettingsInputComponent } from "@mui/icons-material";

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

export default function MoyenPaiement() {
  const { callfunction } = useFunctions();
  const { user } = useAuthContext();
  const [cardLoading, setCardLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [loadingModif, setLoadingModif] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(true);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const foo = async () => {
      const result = await callfunction("getCustomerPaymentMethod", {
        customerId: user.customerId,
      });
      if (result.error) {
        setCardData(false);
        setCardLoading(false);
      } else {
        setCardLoading(false);
        setCardData(result);
      }
    };
    foo();
  }, []);

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const cardElement = elements.getElement(CardElement);
    setLoadingModif(true);
    const { error: errorPayementMethod, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: user.name,
        },
      });

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
    const result = await callfunction("attachNewCard", {
      customer: user.customerId,
      payment_method: pmId,
    });
    if (result.error) {
      setSuccess(false);
      setOpen(true);
      setLoadingModif(false);
      return;
    }
    const resultCard = await callfunction("getCustomerPaymentMethod", {
      customerId: user.customerId,
    });
    setCardData(resultCard);

    if (resultCard.error) setSuccess(false);
    else setSuccess(true);
    setOpen(true);
    cardElement.clear();
  };

  return (
    <Container maxWidth="sm">
      <Box p={2}>
        {!cardLoading ? (
          cardData ? (
            <Box
              margin="auto"
              maxWidth="300px"
              display="flex"
              justifyContent="space-between"
              p={3}
            >
              <Typography>Ma carte : </Typography>
              <Typography>***{cardData.card.last4}</Typography>
              <Typography>
                {cardData.card.exp_month}/{cardData.card.exp_year}
              </Typography>
            </Box>
          ) : (
            <Box
              margin="auto"
              maxWidth="300px"
              display="flex"
              justifyContent="space-between"
              p={3}
            >
              <Typography>Aucune carte ajouté au compte </Typography>
            </Box>
          )
        ) : (
          <Box
            margin="auto"
            maxWidth="300px"
            display="flex"
            justifyContent="space-between"
            p={3}
          >
            <Typography>Chargement de votre carte actuelle... </Typography>
          </Box>
        )}
        <Typography sx={{ paddingY: 2 }}>
          Changer sa carte par défaut :
        </Typography>
        <Paper>
          <Box p={2}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>
        </Paper>
        <Box m={2} textAlign="center">
          {loadingModif ? (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled
            >
              Changement en cours
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Modifier
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key="Snackbar"
        autoHideDuration={3000}
      >
        {success ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Le changement de votre carte à bien été pris en compte.
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Une erreur s'est produite, merci de rééssayer ultérieurement!
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
