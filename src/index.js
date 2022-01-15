import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "@fontsource/roboto";
import { CssBaseline } from "@mui/material";
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import { grey } from '@mui/material/colors';

let theme = createTheme({
  palette: {
    background: {
      default: "#f4f4f4",
    },
    info: {
      // Purple and green play nicely together.
      main: grey[900],
    },
  },

  typography:{
    fontFamily:[
      "Overlock","Roboto"
    ].join(','),
  }
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
