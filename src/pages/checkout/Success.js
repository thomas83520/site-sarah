import { Button, Container, Typography, Box } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function Success() {
    const history = useHistory();

    const handleClick = (route) => {
        history.push(route);
    }
  return (
    <Container maxWidth="md">
      <Box textAlign="center" pt={5}>
        <Typography>
          Merci pour votre achat.
        </Typography>
        <Typography>
            Vous recevrez d'ici peu votre reçu ainsi qu'un mail confirmant votre commande.
        </Typography>
        <Typography>
            Le(s) produit(s) que vous avez acheté vous seront également envoyé(s) par mail, il est possible qu'il(s) vous soi(en)t délivré dans plusieurs minutes. 
        </Typography>
        <Box py={3} px={20} display="flex" textAlign="center" alignItems="center" justifyContent="space-around">
          <Button onClick={()=> handleClick("/")}>Retour à l'accueil</Button>
        </Box>
      </Box>
    </Container>
  );
}