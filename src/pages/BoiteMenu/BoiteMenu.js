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
import { usePanierContext } from "../../hooks/usePanierContext";

const mounthPrice = {
  mensuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule sans engagement paiement mensuel",
    interval:"month",
    interval_count:"1",
    textPrix: "10€/mois",
    prix: 10,
    paymentMode:"subscription",
    metadata:{
      'asEngagement' : false,
      'engagementDuree' : null,
      'periodePaye' : 1
    }
  },
  biAnnuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule engagement 6 mois paiement mensuel",
    textPrix: "9€/mois",
    interval:"month",
    interval_count:"1",
    prix: 9,
    paymentMode:"subscription",
    metadata:{
      'asEngagement' : true,
      'engagementDuree' : 6,
      'periodePaye':1
    }
  },
  annuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule engagement 12 mois paiement mensuel",
    textPrix: "8€/mois",
    interval:"month",
    interval_count:"1",
    prix: 8,
    paymentMode:"subscription",
    metadata:{
      'asEngagement' : true,
      'engagementDuree' : 12,
      'periodePaye':1
    }
  },
};
const yearlyPrice = {
  mensuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule mensuel",
    textPrix: "Non compatible",
    prix: 0,
    paymentMode:"payment",
    metadata:{
      'asEngagement' : false,
      'engagementDuree' : null,

      'periodePaye': 0,
    }
  },
  biAnnuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule engagement 6 mois paiement unique",
    textPrix: "50€",
    interval:"month",
    interval_count:"6",
    prix: 50,
    paymentMode:"subscription",
    metadata:{
      'asEngagement' : true,
      'engagementDuree' : 6,
      'periodePaye': 6,
    }
  },
  annuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule engagement 12 mois paiement unique",
    textPrix: "90€",
    prix: 90,
    paymentMode:"payment",
    metadata:{
      'asEngagement' : false,
      'engagementDuree' : null,
      'periodePaye': 12,
    }
  },
};

export default function BoiteMenu() {
  const [checked, setChecked] = useState(false);
  const [price, setPrice] = useState(mounthPrice);
  const { items, dispatch } = usePanierContext();
  const [added, setAdded] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) setPrice(yearlyPrice);
    else setPrice(mounthPrice);
  };

  const ajoutPanier = (item) => {
    const exist = items.find((element) => element.nom === item.nom);
    if (exist) setAdded(true);
    else {
      dispatch({
        type: "ADD_ITEM",
        payload: [
          ...items,
          item,
        ],
      });
      setAdded(true);
    }
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
      <Box textAlign="center">
        {added && <Typography>Ajouté au panier</Typography>}
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
              {price.mensuel.textPrix}
            </Typography>
            {checked ? (
              <Button size="large" variant="outlined" disabled>
                Je choisis cette formule
              </Button>
            ) : (
              <Button
                size="large"
                variant="outlined"
                onClick={() => ajoutPanier(price.mensuel)}
              >
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
              {price.biAnnuel.textPrix}
            </Typography>
            <Button
              size="large"
              variant="outlined"
              onClick={() => ajoutPanier(price.biAnnuel)}
            >
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
              {price.annuel.textPrix}
            </Typography>

            <Button
              size="large"
              variant="outlined"
              onClick={() => ajoutPanier(price.annuel)}
            >
              Je choisis cette formule
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
