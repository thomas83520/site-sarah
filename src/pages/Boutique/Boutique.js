import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import BoutiqueItem from "./BoutiqueItem";

import image2 from "../../assets/imageBoiteMenu.jpg";
import image1 from "../../assets/imageEbook.jpg";

export default function Boutique() {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center">
        <Typography variant="h2">Ma boutique en ligne</Typography>
        <Typography variant="h5">
          DES OUTILS POUR VOUS FACILITER LA VIE AU QUOTIDIEN
        </Typography>
        <Grid container>
          <Grid item xs={12} md={6}>
            <BoutiqueItem
              title="EBOOK RECETTES HIVER"
              image={image1}
              prix="12€"
              path="/ebook_hiver"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <BoutiqueItem
              title='ABONNEMENT À "LA BOITE À MENU DE SARAH"'
              image={image2}
              prix="à partir de 7.5€ / mois"
              path="/la_boite_a_menu"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
