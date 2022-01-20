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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51KIza7BMhfHQVXqd32lhcVUQdwOR2ttJK2AB6qUKiwGWDNVkw3H34kxNZdjyODyjSmXNJII8hq0TUWpZwHny87tz00ij5XSvHq"
);

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
