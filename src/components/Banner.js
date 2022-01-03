import { Box, Typography } from "@mui/material";
import BoxImage from "./BoxImage";

import BannerPhoto from "../assets/banner.jpg";

import { createTheme, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

let TitleFont = createTheme({
  typography: {
    fontFamily: ["Cookie", "serif"].join(","),
    fontSize: 28,
  },
});

TitleFont = responsiveFontSizes(TitleFont);

export default function Banner({ title }) {
  return (
    <Box
      mt={2}
      width="100%"
      height={150}
      justifyContent="center"
      alignItems="center"
      display="flex"
      sx={{
        position: "relative",
      }}
    >
      <BoxImage src={BannerPhoto} alt="Banner" />
      <ThemeProvider theme={TitleFont}>
        <Typography variant="h3" sx={{ position: "absolute" }} color="#000">
          {title}
        </Typography>
      </ThemeProvider>
    </Box>
  );
}
