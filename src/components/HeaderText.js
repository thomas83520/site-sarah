import {Container,Typography} from '@mui/material'

import { ThemeProvider } from "@emotion/react";
import { createTheme, responsiveFontSizes } from "@mui/material";

let TitleFont = createTheme({
    typography: {
      fontFamily: ["Amatic SC", "serif"].join(","),
      fontSize: 32,
    },
  });
  
  let subTitleFont = createTheme({
    typography: {
      fontFamily: ["Patrick Hand", "serif"].join(","),
      fontSize: 18,
    },
  });
  
  TitleFont = responsiveFontSizes(TitleFont);
  subTitleFont = responsiveFontSizes(subTitleFont);


export default function HeaderText() {
    return (
        <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          padding: "20px",
          paddingTop:{xs:"50px",lg:"0px"}
        }}
      >
        <ThemeProvider theme={TitleFont}>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Sarah ROGGI
          </Typography>
        </ThemeProvider>
        <ThemeProvider theme={subTitleFont}>
          <Typography variant="h5" component="h2">
            Diététicienne-nutritionniste à Marseille
          </Typography>
        </ThemeProvider>
      </Container>
    )
}
