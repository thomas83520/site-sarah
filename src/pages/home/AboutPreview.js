import { NavigateNext } from "@mui/icons-material";
import { Grid, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AboutDisplay from "../../components/AboutDisplay";

//photo
import PhotoColor from "../../assets/PHOTO_COLOR.jpg";
import BoxImage from "../../components/BoxImage";

export default function AboutPreview() {
  return (
    <AboutDisplay>
      <Grid item xs={3}>
        <Box
          sx={{
            height: "100%",
          }}
        >
          <BoxImage src={PhotoColor} alt='Photo profil couleur'/>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box p={5} sx={{ backgroundColor: "#F0F0F0" }}>
          <Typography variant="h5" mb={2}>
            À propos
          </Typography>

          <Typography mb={5} textAlign="justify">
            J'ai 24 ans et je suis passionnée par la nutrition, la cuisine et le
            sport depuis mon adolescence. Devenir diététicienne était donc une
            évidence pour moi. Pour la petite histoire, c'est mon papa qui m'a
            transmis cette passion. J'ai toujours partagé avec lui ses loisirs
            en dehors de son temps de travail : cuisiner, faire du sport (la
            course à pied qui est devenu mon sport favori aujourd'hui) lire des
            livres de cuisine, de nutrition... J'adore à mon tour découvrir,
            tester, inventer de nouvelles recettes toujours plus saines et
            gourmandes. Après avoir obtenu mon baccalauréat, je me suis donc
            orientée vers un DUT Génie biologique option diététique.
          </Typography>

          <Button
            component={Link}
            to="/about"
            variant="outlined"
            endIcon={<NavigateNext />}
            color="info"
          >
            En savoir plus
          </Button>
        </Box>
      </Grid>
    </AboutDisplay>
  );
}
