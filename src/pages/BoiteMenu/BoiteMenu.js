import {
  Container,
  Grid,
  Box,
  Typography,
  Switch,
  Button,
} from "@mui/material";
import { useState } from "react";

import BoiteMenuImage from "../../assets/imageBoiteMenu.jpg";
const mounthPrice = {
  mensuel: "10€/mois",
  biAnnuel: "9€/mois",
  annuel: "8€/mois",
};
const yearlyPrice = {
  mensuel: "Non compatible",
  biAnnuel: "50€",
  annuel: "90€",
};
export default function BoiteMenu() {
  const [checked, setChecked] = useState(false);
  const [price, setPrice] = useState(mounthPrice);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) setPrice(yearlyPrice);
    else setPrice(mounthPrice);
  };
  return (
    <Container maxWidth="lg">
      <Grid container py={5}>
        <Grid item xs={12} lg={6} textAlign="center">
          <Typography pb={1} variant="h4">
            La boite à menus, c'est quoi ?
          </Typography>
          <Box
            component="img"
            height={500}
            alt="Boite à menu image"
            src={BoiteMenuImage}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
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
            sx={{ width: "100%" }}
          >
            <Box
              textAlign="center"
              width="auto"
              p={2}
              m={2}
              borderRadius="25px"
              sx={{ backgroundColor: "#FFFFFF", width: "100%" }}
            >
              <Typography fontWeight="bold" fontSize={22}>
                7 recettes de saison & équilibrées par semaine
              </Typography>
              <Typography>
                variées en fonction des saisons,avec en bonus 2 idées de
                petits-déjeuners par semaine
              </Typography>
            </Box>
            <Box
              textAlign="center"
              p={2}
              m={2}
              borderRadius="25px"
              sx={{ backgroundColor: "#EBDED4", width: "100%" }}
            >
              <Typography fontWeight="bold" fontSize={22}>
                une liste de courses adaptée
              </Typography>
              <Typography>
                sur la base des menus proposés, à personaliser selon vos goûts
              </Typography>
            </Box>

            <Box
              textAlign="center"
              p={2}
              m={2}
              borderRadius="25px"
              sx={{ backgroundColor: "#DAC3C2", width: "100%" }}
            >
              <Typography fontWeight="bold" fontSize={22}>
                le conseil diet de la semaine
              </Typography>
              <Typography>
                Pour vous informer sur la nutrition & vous dévoiler mes
                meilleurs conseils en tant que diététicienne
              </Typography>
            </Box>
            <Grid container justifyContent="center">
              <Grid item xs={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box
                    height={100}
                    width={100}
                    borderRadius="10px"
                    sx={{ backgroundColor: "lightcoral" }}
                  />
                  <Typography>Tu choisis ta formule d'abonnement</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} textAlign="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box
                    height={100}
                    width={100}
                    borderRadius="10px"
                    sx={{ backgroundColor: "lightcoral" }}
                  />
                  <Typography>
                    Tu reçois chaque semaine ta boîte à menus dans tes mails
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} textAlign="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box
                    height={100}
                    width={100}
                    borderRadius="10px"
                    sx={{ backgroundColor: "lightcoral" }}
                  />
                  <Typography>
                    Tu découvre un nouveau concept & tu te fais plaisir !
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box textAlign="center" py={5}>
        <Typography variant="h3">
          Choisis la formule qui te correspond
        </Typography>
        <Typography>
          POUR RECEVOIR TES MENUS & TES RECETTES DANS TA BOITE MAIL CHAQUE
          SEMAINE
        </Typography>
        <Box
          display="flex"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>Mensuel</Typography>
          <Switch checked={checked} onChange={handleChange} />
          <Typography>Annuel</Typography>
        </Box>
      </Box>
      <Grid container spacing={2} pt={3} pb={10}>
        <Grid item xs={4}>
          <Box
            sx={{ backgroundColor: checked ? "#222222" : "#DAC3C2" }}
            p={5}
            mb={5}
            textAlign="center"
          >
            <Typography pb={4} variant="h4">
              Mensuel
            </Typography>
            <Typography>Sans engagement de durée:</Typography>
            <Typography>
              Vous recevez chaque semaine votre boîte à menus et vous pouvez
              résilier votre abonnement à tous moments
            </Typography>

            <Typography py={3} textAlign="center">
              {price.mensuel}
            </Typography>
            {checked ? (
              <Button size="large" variant="outlined" disabled>
                Je choisis cette formule
              </Button>
            ) : (
              <Button size="large" variant="outlined">
                Je choisis cette formule
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{ backgroundColor: "#F8F0E0" }}
            p={5}
            mb={5}
            textAlign="center"
          >
            <Typography pb={4} variant="h4">
              6 mois
            </Typography>
            <Typography>
              Pour commencer à vous constiuer de bonnes bases sur l'équilibre
              alimentaire
            </Typography>
            <Typography>
              Accès aux semaines de menus avec un engagement de 6 mois*
              renouvelable
            </Typography>
            <Typography py={3} textAlign="center">
              {price.biAnnuel}
            </Typography>
            <Button size="large" variant="outlined">
              Je choisis cette formule
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{ backgroundColor: "#E3E3E3" }}
            p={5}
            mb={5}
            textAlign="center"
          >
            <Typography pb={4} variant="h4">
              12 mois
            </Typography>
            <Typography>
              Un moyen de découvrir plein de nouvelles idées recettes au fil des
              saisons !
            </Typography>
            <Typography>
              Accès aux semaines de menus avec un engagement de 12 mois*.
            </Typography>
            <Typography py={3} textAlign="center">
              {price.annuel}
            </Typography>

            <Button size="large" variant="outlined">
              Je choisis cette formule
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
