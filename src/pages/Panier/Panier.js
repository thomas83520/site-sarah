import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Link,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { usePanierContext } from "../../hooks/usePanierContext";
import PanierItem from "./PanierItem";
import { useFunctions } from "../../hooks/useFunctions";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";

export default function Panier() {
  const history = useHistory();
  const { items, dispatch } = usePanierContext();
  const stripe = useStripe();
  const elements = useElements();
  const totalPrice = items.reduce((p, c) => p + c.prix, 0);
  const { createStripeCheckout, createOrder, response } = useFunctions();
  const { user } = useAuthContext();
  const { callfunction } = useFunctions();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCheckBox, setErrorCheckbox] = useState(false);
  const [checked, setChecked] = useState(false);

  const boutiqueClick = async () => {
    history.push("/boutique");
  };

  const needConnect = async () => {
    history.push("/login");
  };

  const handleCheckout = async () => {
<<<<<<< HEAD
    if (!user) history.push("/login");
    let paymentMode = "payment";
    let payment_intent_data = {};
    let subscription_data = {};
    let line_items = items.map((item) => {
      if (item.paymentMode === "subscription") {
        paymentMode = "subscription";
        subscription_data.metadata = {
          asEngagement: item.metadata.asEngagement,
          dureeEngagement: item.metadata.engagementDuree,
          periodePaye: item.metadata.periodePaye,
        };
        return {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: item.prix * 100,
            product_data: {
              name: item.nom,
              description: item.infoText,
            },
            recurring: {
              interval: item.interval,
              interval_count: item.interval_count,
            },
          },
        };
      } else {
        return {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: item.prix * 100,
            product_data: {
              name: item.nom,
              description: item.infoText,
            },
          },
        };
=======
    setLoading(true);
    setErrorCheckbox(false);
    if (!checked) {
      setErrorMessage("Veuillez accepeter les conditions générales de ventes");
      setErrorCheckbox(true);
      setLoading(false);
      return;
    }
    if (!user) {
      history.push("/login");
      return;
    }
    let contains = false;
    var paymentType = "payment";
    var paymentItems = [];
    var subscriptionItems = [];
    var priceIds = [];
    var productIds = [];
    var totalSubscription = 0;
    var cycle = "";
    items.map((item) => {
      if (user.achats.includes(item.productId)) {
        contains = true;
        return;
      }
      if (item.paymentType === "payment") {
        paymentItems.push({ price: item.priceId });
      }
      if (item.paymentType === "subscription") {
        totalSubscription += item.prix;
        cycle = item.interval_count;
        paymentType = "subscription";
        subscriptionItems.push({ price: item.priceId });
>>>>>>> boutique
      }
      priceIds.push(item.priceId);
      productIds.push(item.productId);
    });
    if (contains) {
      setErrorMessage("Vous possédez déjà un des articles du panier");
      setLoading(false);
      return;
    }
    const data = {
      paymentType,
      paymentItems,
      subscriptionItems,
      priceIds,
      productIds,
      user,
      totalPrice,
    };

    const result = await callfunction("createPaymentIntent", data);
    history.push("/checkout", {
      clientSecret: result.clientSecret,
      totalPrice,
      totalSubscription,
      paymentType,
      cycle,
      items,
    });
    dispatch({ type: "CLEAN_PANIER" });
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      {items.length > 0 ? (
        <Box>
          {items.map((item) => (
            <PanierItem key={item.nom} item={item} />
          ))}
          <Box
            mx="auto"
            justifyContent="space-between"
            textAlign="center"
            alignItems="center"
            p={3}
            width={1}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              textAlign="center"
              alignItems="center"
              pb={2}
              width={1}
            >
              <Typography variant="h5">Prix Total : </Typography>
              <Typography variant="h5">{totalPrice}€</Typography>
            </Box>
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            <Box display="flex" alignItems="center">
              <Checkbox
                sx={{
                  color: errorCheckBox ? "red" : "",
                  "&.Mui-checked": {
                    color: errorCheckBox ? "red" : "",
                  },
                }}
                size="small"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />

              <Typography
                color={errorCheckBox ? "error" : ""}
                variant="body1"
                pr={1}
              >
                J'accepte les{" "}
              </Typography>
              <Link
                component={RouterLink}
                to="/terms"
                color="inherit"
                underline="hover"
              >
                <Typography
                  color={errorCheckBox ? "error" : ""}
                  variant="body1"
                >
                  conditions générales de ventes.
                </Typography>
              </Link>
            </Box>
            {loading ? (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                color="secondary"
                size="large"
                disabled
              >
                Chargement..
              </Button>
            ) : user ? (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                color="secondary"
                size="large"
                onClick={handleCheckout}
              >
                Payer
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                color="secondary"
                size="large"
                onClick={needConnect}
              >
                Se connecter
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box textAlign="center" m={3}>
          <Typography textAlign="center" m={3}>
            Votre panier est vide
          </Typography>
          <Button variant="text" onClick={boutiqueClick}>
            Aller à la boutique
          </Button>
        </Box>
      )}
    </Container>
  );
}
