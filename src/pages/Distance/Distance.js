import { Container, Grid, Typography, Link } from "@mui/material";
import { Box } from "@mui/system";
import Banner from "../../components/Banner";
import SuiviWithoutSubtitle from "./SuiviWithoutSubtitle";
import SuiviWithSubtitle from "./SuiviWithSubtitle";

export default function Distance() {
  return (
    <Box>
      <Banner title={"Suivi à distance"} />
      <Container maxWidth="lg">
        <Grid container py={5} spacing={5}>
          <Grid item xs={12} md={6}>
            <SuiviWithoutSubtitle
              title="Consultation initiale (1 heure) "
              price="50€"
            >
              <Typography textAlign="justify" py={3}>
                Pour débuter un suivi diététique à distance, il suffit de
                m'envoyer un mail ou de remplir la rubrique "prendre
                rendez-vous". Vous pouvez également me retrouver sur Doctolib
                pour choisir un créneau en fonction de vos disponibilité:
              </Typography>
              <Box width="100%" textAlign={{xs:"start",md:"center"}} fontSize={{xs:"small",md:"medium"}}>
                <Link href="https://www.doctolib.fr/dieteticien/marseille/sarah-roggi" target="_blank" underline="hover">
                  https://www.doctolib.fr/dieteticien/marseille/sarah-roggi
                </Link>
              </Box>
              <Typography py={3}>
                Le déroulé sera le même que pour une consultation à domicile,
                cependant vous réaliserez vous-même vos mesures à la maison.{" "}
              </Typography>
              <Typography>
                La consultation se déroulera par Skype ou par téléphone selon
                vos envies.
              </Typography>
            </SuiviWithoutSubtitle>

            <SuiviWithoutSubtitle
              title="Consultation de suivi (30 minutes) "
              price="35€"
            >
              <Typography textAlign="justify" py={3}>
                Le déroulé de cette consultation sera le même que la
                consultation à domicile de suivi (nous réajustons le plan
                alimentaire si besoin, fixation de nouveaux objectifs, conseils
                spécifiques, suivi du poids et des mesures...)
              </Typography>
              <Typography textAlign="justify">
                Des documents divers et/ou des exemples de menus vous seront
                remis après chaque consultation de suivi en fonction de vos
                besoins.
              </Typography>
            </SuiviWithoutSubtitle>
          </Grid>
          <Grid item xs={12} md={6}>
            <SuiviWithSubtitle
              title="Formule 1 mois de suivi"
              price="115€"
              subtitle="1 consultation initiale + 2 consultations de suivi + échanges réguliers par mail"
            >
              <Box py={4}>
                <Typography>
                  Nous réalisons régulièrement des bilans écrits par mail et
                  vous bénéficiez de 3 consultations espacées de 15 jours à 3
                  semaines (une consultation initiale de 1H + 2 consultation de
                  suivi de 30 min)
                </Typography>
                <Typography>
                  Vous pourrez me contacter par mail quotidiennement si besoin.
                </Typography>
              </Box>
            </SuiviWithSubtitle>
            <SuiviWithSubtitle
              title="Formule 2 mois de suivi"
              price="145€"
              subtitle="1 consultation initiale + 3 consultations de suivi + échanges réguliers par mail"
            >
              <Box py={4}>
                <Typography>
                  La régularité du suivi est source de motivation dans le cadre
                  d'une perte de poids et permet d'atteindre plus facilement les
                  objectifs fixés.
                </Typography>
              </Box>
            </SuiviWithSubtitle>

            <Typography fontWeight="bold">
              Tarif étudiant et demandeur d'emploi -5€ pour chaque formule sur
              présentation d'un justificatif
            </Typography>
          </Grid>
        </Grid>
        <Container maxWidth="md" sx={{marginBottom:'20px'}}>
          <Typography fontWeight="bold" variant="h6">Paiement : </Typography>
          <Typography fontWeight="bold">
            Il sera à effectuer au plus tard le jour même de la consultation par
            virement bancaire ou via Paypal. Un document explicatif vous sera
            remis pour procéder au paiement en toute simplicité.
          </Typography>
        </Container>
      </Container>
    </Box>
  );
}
