import { Container, Typography, Box, Link } from "@mui/material";
import React from "react";
import { grey } from "@mui/material/colors";

import cgv from "../../assets/CGV.pdf";

export default function Terms() {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" pt={3}>
        <Typography variant="h5">MENTIONS LEGALES</Typography>
      </Box>
      <Box>
        <Box py={2}>
          <Typography fontSize={20} variant="button">
            ROGGI Sarah
          </Typography>
        </Box>
        <Typography color={grey[700]} variant="body1">
          Adresse : 44 chemin des chaûmes, 83170 Brignoles
        </Typography>
        <Typography color={grey[700]} variant="body1">
          Email : sarahroggi.dieteticienne@gmail.com
        </Typography>
        <Typography color={grey[700]} variant="body1">
          N° SIREN : 880377643
        </Typography>
        <Typography color={grey[700]} variant="body1">
          Hébergement : Firebase
        </Typography>
      </Box>
      <Box textAlign="center" pt={3}>
        <Typography variant="h5">
          CONDITIONS GÉNÉRALES DE VENTE (CGV)
        </Typography>
      </Box>
      <Box pt={1} pb={2} textAlign="center">
        <Link href={cgv} target="_blank" download>
          Télécharger les CGV
        </Link>
      </Box>
    </Container>
  );
}
