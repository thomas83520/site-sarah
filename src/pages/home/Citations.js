import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { Box, Typography } from "@mui/material";


import { createTheme, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@emotion/react";


let TitleFont = createTheme({
  typography: {
    fontFamily: ["Amatic SC", "roboto"].join(","),
    fontSize:31
  },
});

TitleFont = responsiveFontSizes(TitleFont);

export default function Citations() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      textAlign="center"
      alignItems="center"
      pt={3}
    >
      <FormatQuoteRoundedIcon sx={{ fontSize: 80, color: "darkseagreen" }} />
      <ThemeProvider theme={TitleFont}>
        <Typography fontWeight="bold">
          UNE ALIMENTATION ALLIANT ÉQUILIBRE ET PLAISIR POUR SE SENTIR BIEN DANS
          SON CORPS ET DANS SA TÊTE
        </Typography>
      </ThemeProvider>
    </Box>
  );
}
