import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

import "@fontsource/roboto";
import { CssBaseline } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { grey } from "@mui/material/colors";
import { PanierContextProvider } from "./context/PanierContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripe_id = process.env.REACT_APP_STRIPE_API_KEY_PROD;
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripe_id);

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

  typography: {
    fontFamily: ["Overlock", "Roboto"].join(","),
  },
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PanierContextProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </PanierContextProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
