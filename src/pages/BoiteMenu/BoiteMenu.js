import {
  Container,
  Grid,
  Box,
  Typography,
  Switch,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BoiteMenuImage from "../../assets/imageBoiteMenu.jpg";
import photo1Min from "../../assets/photo1.jpg";
import photo2Min from "../../assets/photo2.jpg";
import photo3Min from "../../assets/photo3.jpg";
import { usePanierContext } from "../../hooks/usePanierContext";
import Question from "./Question";

const price = {
  mensuel: {
    nom: "La boite à menus de Sarah",
    infoText: "formule sans engagement, paiement mensuel (durée : 1an )",
    interval: "month",
    interval_count: "1",
    textPrix: "10€/mois",
    prix: 10,
    paymentType: "subscription",
    productId: "prod_LxWDDyE08dAZ7A",
    priceId: "price_1LFbB9BMhfHQVXqd5F4FvTqv",
    metadata: {
      asEngagement: false,
      engagementDuree: null,
      periodePaye: 1,
    },
  },
  biAnnuel: {
    nom: "La boite à menus de Sarah",
    infoText:
      "formule sans engagement, paiement tous les 6 mois (durée : 1an )",
    textPrix: "50€ tous les 6 mois",
    interval: "month",
    interval_count: "6",
    prix: 50,
    paymentType: "subscription",
    productId: "prod_LxWDDyE08dAZ7A",
    priceId: "price_1LFbB9BMhfHQVXqdmAsBDRHP",
    metadata: {
      asEngagement: true,
      engagementDuree: 6,
      periodePaye: 1,
    },
  },
  annuel: {
    nom: "La boite à menus de Sarah",
    infoText:
      "Paiement unique pour toute la durée de la boite à menus ( 1 an )",
    textPrix: "90€",
    interval: "month",
    interval_count: "12",
    prix: 90,
    paymentType: "subscription",
    productId: "prod_LxWDDyE08dAZ7A",
    priceId: "price_1LFbB9BMhfHQVXqdTyqLun2g",
    metadata: {
      asEngagement: true,
      engagementDuree: 12,
      periodePaye: 1,
    },
  },
};

export default function BoiteMenu() {
  const { items, dispatch } = usePanierContext();
  const [added, setAdded] = useState(false);

  const ajoutPanier = (item) => {
    const exist = items.find((element) => element.productId === item.productId);
    if (exist) setAdded(true);
    else {
      dispatch({
        type: "ADD_ITEM",
        payload: [...items, item],
      });
      setAdded(true);
    }
  };

  const handleClose = () => setAdded(false);

  return (
    <Container maxWidth="lg">
      <Grid container py={5}>
        <Grid item xs={12} lg={6} textAlign="center">
          <Typography pb={1} variant="h4">
            La boite à menus, c'est quoi ?
          </Typography>
          <Box
            component="img"
            maxWidth="100%"
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
                7 recettes de saison & équilibrées par semaine pendant 1 an
              </Typography>
              <Typography>
                variées en fonction des saisons, avec en bonus 2 idées de
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
                Une liste de courses adaptée
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
                Le conseil diet de la semaine
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
                    component="img"
                    height={100}
                    width={100}
                    borderRadius="10px"
                    src={photo1Min}
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
                    component="img"
                    height={100}
                    width={100}
                    borderRadius="10px"
                    src={photo2Min}
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
                    component="img"
                    height={100}
                    width={100}
                    borderRadius="10px"
                    src={photo3Min}
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
      <Box margin="auto" textAlign="center" maxWidth="700px">
        <Typography p={2} variant="h4">
          Description
        </Typography>
        <Typography>
          Vous voulez en finir avec les éternels “on mange quoi cette semaine ?”
          Simplifier l’organisation de vos repas au quotidien ? Rééquilibrer vos
          menus tout en respectant la saisonnalité des fruits et légumes ? Vous
          êtes au bon endroit ! Avec ma boîte à menus remise chaque semaine dans
          votre boîte mail, vous ne manquerez plus jamais d’inspiration pour
          cuisiner vos repas de la semaine.
        </Typography>
      </Box>
      <Box py={3} margin="auto" maxWidth="700px">
        <Typography py={2} variant="h4">
          Questions fréquentes :
        </Typography>
        <Question question="Comment fonctionne la boîte à menus ?">
          <Typography>
            Lorsque vous avez choisi la formule d’abonnement souhaitée, vous
            recevrez un mail avec le guide d’utilisation de la boîte à menus
            dans les quelques minutes qui suivent. Vous recevrez ensuite chaque
            jeudi à 17:30 les menus de la semaine suivante. L’abonnement a une
            durée maximale de 1 an et s’annule automatiquement au bout de cette
            période.
          </Typography>
          <Typography>
            Une fois votre boîte à menus reçue, c’est à vous d’imprimer et de
            personnaliser votre liste de courses qui sel trouve en fin de
            document. Il ne reste plus qu’à vous régaler avec de nouvelles
            recettes simples et équilibrées du quotidien !
          </Typography>
        </Question>
        <Question question="Vais-je perdre du poids avec la boîte à menus ?">
          <Typography>
            Tout dépend de vos habitudes alimentaires et de votre poids actuel
            par rapport à votre poids de forme. Si votre poids actuel se situe
            au-dessus de votre poids de forme et que votre alimentation en ce
            moment est déséquilibrée (peu de légumes dans l’assiette, pas assez
            de produits bruts etc…) oui il est tout à fait possible de perdre du
            poids avec la boîte à menus !
          </Typography>
        </Question>
        <Question question="Je ne sais pas cuisiner, est-ce que les recettes seront adaptées pour moi ?">
          <Typography>
            Toutes les recettes proposées sont faciles à cuisiner et ne
            demandent pas d’avoir un bon niveau en cuisine pour être réalisées.
            Si vous n’avez pas l’habitude de cuisiner, la boîte à menus pourra
            justement vous aider à manger plus varié, à apprendre petit à petit
            à cuisiner des recettes faciles et à vous faire plaisir en
            diversifiant le contenu de vos assiettes.
          </Typography>
        </Question>
        <Question question="Comment faire si je ne consomme pas de viande ?">
          <Typography>
            Chaque semaine, des menus sans viande sont proposés dans la boîte à
            menus. Pour toutes les recettes qui contiennent de la viande, vous
            pouvez facilement la remplacer par d’autres sources de protéines en
            fonction de vos habitudes alimentaires (tofu grillé, seitan, légumes
            secs…). Tout est expliqué dans le guide d’utilisation qui vous sera
            remis au début de votre abonnement.
          </Typography>
        </Question>
        <Question question="Les recettes sont proposées pour combien de personnes ?">
          <Typography>
            Les recettes sont proposées pour plus ou moins 4 personnes de sorte
            à ce que :
          </Typography>
          <Box p={2}>
            <Typography>
              - Vous puissiez utiliser approximativement les quantités données
              pour une famille de 4
            </Typography>
            <Typography>
              - Vous puissiez réaliser des lunch box avec les restes si vous
              êtes 2 ou 3 à la maison
            </Typography>
            <Typography>
              - Ou encore diviser facilement les quantités par 2 ou 4 si vous
              n’avez pas besoin d’avoir de restes (lorsque vous êtes 2) ou si
              vous vivez seul(e).
            </Typography>
          </Box>
          <Typography>
            Dans tous les cas, adaptez les proportions en fonction de vous : de
            votre appétit et du nombre de personnes qui composent votre famille
            !
          </Typography>
        </Question>
      </Box>
      <Box textAlign="center" py={5}>
        <Typography variant="h3">
          Choisis la formule qui te correspond
        </Typography>
        <Typography>
          POUR RECEVOIR TES MENUS & TES RECETTES DANS TA BOITE MAIL CHAQUE
          SEMAINE
        </Typography>
      </Box>
      <Box textAlign="center">
        {added && <Typography>Ajouté au panier</Typography>}
      </Box>
      <Grid container spacing={2} pt={3} pb={10}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{ backgroundColor: "#DAC3C2" }}
            p={5}
            mb={5}
            textAlign="center"
            height="350px"
            position="relative"
          >
            <Typography pb={4} variant="h4">
              Mensuel
            </Typography>
            <Typography>
              Vous recevez chaque semaine votre boîte à menus et vous pouvez
              résilier votre abonnement à tous moments
            </Typography>

            <Box
              position="absolute"
              left="50%"
              bottom="100px"
              sx={{
                transform: "translate(-50%, 0)",
              }}
            >
              <Typography py={3} textAlign="center">
                {price.mensuel.textPrix}
              </Typography>
            </Box>
            <Box
              position="absolute"
              left="50%"
              bottom="30px"
              sx={{
                transform: "translate(-50%, 0)",
              }}
            >
              <Button
                size="large"
                variant="outlined"
                onClick={() => ajoutPanier(price.mensuel)}
              >
                Je choisis cette formule
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{ backgroundColor: "#F8F0E0" }}
            p={5}
            mb={5}
            textAlign="center"
            height="350px"
            position="relative"
          >
            <Typography pb={4} variant="h4">
              6 mois
            </Typography>
            <Typography>
              Pour commencer à vous constiuer de bonnes bases sur l'équilibre
              alimentaire
            </Typography>
            <Box
              position="absolute"
              left="50%"
              bottom="100px"
              sx={{
                transform: "translate(-50%, 0)",
              }}
            >
              <Typography py={3} textAlign="center">
                {price.biAnnuel.textPrix}
              </Typography>
            </Box>
            <Box
              position="absolute"
              left="50%"
              bottom="30px"
              sx={{
                transform: "translate(-50%, 0)",
              }}
            >
              <Button
                size="large"
                variant="outlined"
                onClick={() => ajoutPanier(price.biAnnuel)}
              >
                Je choisis cette formule
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{ backgroundColor: "#E3E3E3" }}
            p={5}
            mb={5}
            textAlign="center"
            height="350px"
            position="relative"
          >
            <Typography pb={4} variant="h4">
              12 mois
            </Typography>
            <Typography>
              Un moyen de découvrir plein de nouvelles idées recettes au fil des
              saisons !
            </Typography>

            <Box
              position="absolute"
              left="50%"
              bottom="100px"
              sx={{
                transform: "translate(-50%, 0)",
              }}
            >
              <Typography py={3} textAlign="center">
                {price.annuel.textPrix}
              </Typography>
            </Box>
            <Box
              position="absolute"
              sx={{
                transform: "translate(-50%, 0)",
              }}
              left="50%"
              bottom="30px"
            >
              <Button
                size="large"
                variant="outlined"
                onClick={() => ajoutPanier(price.annuel)}
              >
                Je choisis cette formule
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
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
