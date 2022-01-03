import { Box, Typography } from "@mui/material";

import { createTheme, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

let TitleFont = createTheme({
  typography: {
    fontFamily: ["Patrick Hand", "serif"].join(","),
    fontSize:15
  },
});

TitleFont = responsiveFontSizes(TitleFont);

export default function SuiviWithoutSubtitle({ title, price, children }) {
  return (
    <Box py={3}>
      <Box display="flex" justifyContent="space-evenly">
        <ThemeProvider theme={TitleFont}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h4" fontWeight="bold" color="#4F9092">{price}</Typography>
        </ThemeProvider>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
