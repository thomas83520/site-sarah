import { Container, Grid, Box, Typography, Button } from "@mui/material";

import ebook from "../../assets/imageEbook.jpg";
import { usePanierContext } from "../../hooks/usePanierContext";
import { useState } from "react";

export default function Ebook() {
  const { items, dispatch } = usePanierContext();
  const [added, setAdded] = useState(false);
  const handleClick = () => {
    const exist = items.find((element) => element.nom === "Ebook");
    if (exist) setAdded(true);
    else {
      dispatch({
        type: "ADD_ITEM",
        payload: [...items, { nom: "Ebook",infoText:"On mange quoi demain? version hiver",textPrix: "12€",prix:12,paymentType:"payment" }],
      });
      setAdded(true);
    }
  };
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
              <Typography>Description</Typography>
            </Box>
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
    </Container>
  );
}
