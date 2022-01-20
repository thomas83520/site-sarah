import { Container, Typography, Box, Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { usePanierContext } from "../../hooks/usePanierContext";
import PanierItem from "./PanierItem";
import { useFunctions } from "../../hooks/useFunctions";
import { useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Panier() {
  const history = useHistory();
  const { items } = usePanierContext();
  const stripe = useStripe();
  const elements = useElements();
  const TotalPrice = items.reduce((p, c) => p + c.prix, 0);
  const { createStripeCheckout, response } = useFunctions();
  const { user } = useAuthContext();

  const boutiqueClick = () => {
    history.push("/boutique");
  };

  const handleCheckout = async () => {
    if (!user) history.push("/login");
    let paymentMode = "payment";
    let line_items = items.map((item) => {
      console.log("item",item);
      console.log("item payment mode",item.paymentMode)
      if (item.paymentMode === "subscription") {
        paymentMode="subscription";
        return {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: item.prix * 100,
            product_data: {
              name:item.nom,
              description:item.infoText
            },
            recurring:{
              interval : item.interval,
              interval_count : item.interval_count,
            }
          },
        }
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
      }
    });
    createStripeCheckout("createStripeCheckout", {
      paymentMode,
      line_items,
    });
  };

  useEffect(() => {
    if (!stripe || !elements) return;
    if (response.data) {
      const sessionId = response.data.data.id;
      stripe.redirectToCheckout({ sessionId: sessionId });
    }
  }, [response.data]);

  return (
    <Container maxWidth="md">
      {items.length > 0 ? (
        <Box>
          {items.map((item) => (
            <PanierItem key={item.nom} item={item} />
          ))}
          <Box
            mx={5}
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
              <Typography variant="h5">{TotalPrice}€</Typography>
            </Box>
            {response.isPending ? (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                color="secondary"
                size="large"
                disabled
              >
                {" "}
                Chargement..
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                color="secondary"
                size="large"
                onClick={handleCheckout}
              >
                Payer
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
