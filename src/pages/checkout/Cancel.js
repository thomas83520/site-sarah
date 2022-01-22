import { Button, Container, Typography, Box } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function Cancel() {
    const history = useHistory();

    const handleClick = (route) => {
        history.push(route);
    }
  return (
    <Container maxWidth="md">
      <Box textAlign="center" pt={5}>
        <Typography>
          Votre paiement à été annulé. Vous ne serez pas débité.
        </Typography>
        <Typography>
          Si vous n'êtes pas à l'origine de l'annulation, veuillez me contacter
          par mail : sarahroggi.dieteticienne@gmail.com
        </Typography>
        <Box py={3} px={20} display="flex" textAlign="center" alignItems="center" justifyContent="space-around">
          <Button onClick={()=> handleClick("/")}>Retour à l'accueil</Button>
          <Button onClick={()=> handleClick("/boutique")}>Boutique</Button>
        </Box>
      </Box>
    </Container>
  );
}
