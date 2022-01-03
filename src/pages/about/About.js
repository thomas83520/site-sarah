import { Box, Grid, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import AboutDisplay from "../../components/AboutDisplay";
import Banner from "../../components/Banner";
import BoxImage from "../../components/BoxImage";

//Image
import PhotoNB from '../../assets/PHOTO_NB.jpg'

export default function About() {
  return (
    <Box>
      <Banner title="À propos"/>
      <Container maxWidth="lg">
        <Box>
          <AboutDisplay>
            <Grid item xs={4}>
              <BoxImage src={PhotoNB} alt='Image profil noir et blanc' />
            </Grid>
            <Grid item xs={8}>
              <Box p={2} sx={{ backgroundColor: "#F0F0F0" }}>
                <Typography mb={3} textAlign="justify">
                  J'ai 24 ans et je suis passionnée par la nutrition, la cuisine
                  et le sport depuis mon adolescence. Devenir diététicienne
                  était donc une évidence pour moi. Pour la petite histoire,
                  c'est mon papa qui m'a transmis cette passion. J'ai toujours
                  partagé avec lui ses loisirs en dehors de son temps de travail
                  : cuisiner, faire du sport (la course à pied qui est devenu
                  mon sport phare aujourd'hui) lire des livres de cuisine, de
                  nutrition... J'adore à mon tour découvrir, tester, inventer de
                  nouvelles recettes qui soient saines et gourmandes. Après
                  avoir obtenu mon baccalauréat, je me suis donc orientée vers
                  un DUT Génie biologique option diététique. J'ai obtenu mon
                  diplôme en Juin 2018 et depuis, j'ai découvert la diététique
                  sous plusieurs angles : centre de rééquilibrage alimentaire,
                  secteur hospitalier et agence de portage de repas à domicile
                  pour les personnes âgées : ainsi, j'ai souvent été confrontée
                  à des cas de dénutrition, pathologies chroniques, diabètes,
                  surpoids, obésité... Ce qui m'a permis d'enrichir mes
                  connaissances dans plusieurs secteurs de la nutrition.
                </Typography>

                <Typography mb={3}>
                  Vous souhaitez bénéficier d'une prise en charge ?
                </Typography>
                <Button
                  component={Link}
                  to="/meeting"
                  variant="outlined"
                  color="info"
                >
                  Contacter moi ici
                </Button>
              </Box>
            </Grid>
          </AboutDisplay>
        </Box>
      </Container>
    </Box>
  );
}
