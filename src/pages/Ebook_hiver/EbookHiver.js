import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import ebook from "../../assets/imageEbook.jpg";
import { usePanierContext } from "../../hooks/usePanierContext";
import { useState } from "react";

export default function Ebook() {
  const { items, dispatch } = usePanierContext();
  const [added, setAdded] = useState(false);
  const handleClick = () => {
    const exist = items.find(
      (element) => element.productId === "prod_KzLut2yTPxBcIy"
    );
    if (exist) setAdded(true);
    else {
      dispatch({
        type: "ADD_ITEM",
        payload: [
          ...items,
          {
            nom: "Ebook",
            infoText: "On mange quoi demain? version hiver",
            textPrix: "12€",
            prix: 12,
            productId: "prod_KzLut2yTPxBcIy",
            paymentType: "payment",
            metadata: { productName: "Ebookhiver" },
            priceId: "price_1KJNCMBMhfHQVXqdbncBqRcB",
          },
        ],
      });
      setAdded(true);
    }
  };

  const handleClose = () => setAdded(false);
  return (
    <Container maxWidth="lg">
      <Typography pt={5} variant="h2" textAlign="center">
        Ebook recettes d'hiver
      </Typography>
      <Grid container py={5}>
        <Grid item xs={12} md={8} textAlign="center">
          <Box
            component="img"
            height={500}
            alt="Couverture ebook"
            src={ebook}
            sx={{ verticalAlign: "middle" }}
          ></Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "start" },
            alignItems: "center",
          }}
        >
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <Box>
              <Typography
                pt={3}
                fontSize={48}
                fontWeight="bold"
                sx={{ color: "#DAC3C2" }}
              >
                12€
              </Typography>
            </Box>
            <Button variant="outlined" color="secondary" onClick={handleClick}>
              Ajouter au panier
            </Button>
            {added ? <Typography>Ajouté au panier</Typography> : null}
          </Box>
        </Grid>
      </Grid>
      <Container maxWidth="md">
        <Box textAlign="center" pb={10} pt={2}>
          <Typography pb={3} variant="h4" sx={{ textDecoration: "underline" }}>
            Description:
          </Typography>
          <Typography>
            {" "}
            Je vous présente mon tout premier Ebook de recettes d'hiver saines
            et gourmandes ! <br />
            <br />
            Vous découvrirez à l'intérieur 20 recettes inédites: <br />
            - 5 recettes de petits déjeuners <br />
            - 5 recettes de déjeuners rapides sur le pouce <br />
            - 5 recettes de plats chauds et douillets <br />
            - 5 recettes de desserts / collations saines et gourmandes
            <br /> <br />
            Tout au long de l'Ebook, vous trouverez des fiches nutrition
            associées aux recettes. Plusieurs thèmes sont abordés: l'intérêt de
            mettre des légumes dans ses gâteaux, varier ses produits céréaliers,
            comparaison entre des céréales du petit déjeuner industrielles et
            faites maison ... <br />
            <br />
            N'hésitez pas à prendre en photo vos réalisations et à me les
            envoyer !<br />
            <br />
            Je vous souhaite une bonne dégustation !
          </Typography>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={added}
        onClose={handleClose}
        key="Snackbar"
        autoHideDuration={3000}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Ajouté au panier
        </Alert>
      </Snackbar>
    </Container>
  );
}
