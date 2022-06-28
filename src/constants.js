import { createTheme } from "@mui/material/styles";

export let myAccountPartTitle = createTheme({
  typography: { fontFamily: ["Staatliches", "Roboto"].join(",") },
  palette: {
    primary: { main: "#6E4A1E", contrastText: "#fff" },
  },
});

export let myAccountAboName = createTheme({
    typography: { fontFamily: ["Staatliches", "Roboto"].join(",") },
    palette: {
      primary: { main: "#A66F2D", contrastText: "#fff" },
    },
  });

  export let myAccountAboPart = createTheme({
    typography: { fontFamily: ["Staatliches", "Roboto"].join(",") },
    palette: {
      primary: { main: "#B37853", contrastText: "#fff" },
    },
  });
  