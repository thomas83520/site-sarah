import { Box, Container } from "@mui/material";
import Banner from "../../components/Banner";
import DomicileContent from "./DomicileContent";

export default function Domicile() {
  return (
    <Box>
      <Banner title="Consultations /tarifs" />
      <Container maxWidth="lg">
        <Box sx={{ color: "red" }} pt={1}>
          Attention, je ne prends actuellement plus de nouveaux patients (pour
          une période non définie), merci de votre compréhension. Les patients
          déjà en suivi peuvent toujours prendre rendez-vous directement par
          mail : sarah roggi.dieteticienne@gmail.com
        </Box>
        <DomicileContent />
      </Container>
    </Box>
  );
}
