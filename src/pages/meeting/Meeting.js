import { Container, Typography,Box } from "@mui/material";
import React from "react";
import { InlineWidget } from "react-calendly";

export default function Meeting() {
  return (
    <Container maxWidth="md">
      <Box p={2}>
        <Typography variant="h4" textAlign="center">
          Prendre rendez-vous en ligne
        </Typography>
        <InlineWidget url="https://calendly.com/sarahroggi-dieteticienne" />
      </Box>
    </Container>
  );
}
