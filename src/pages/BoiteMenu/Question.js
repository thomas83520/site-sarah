import React from "react";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Question({question,children}) {
  return (
    <Box my={2}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="span" fontWeight="bold">{question}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="span">
            {children}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
