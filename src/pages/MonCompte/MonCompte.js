import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MyAccount from "./panel/MyAccount";
import MyInfos from "./panel/MyInfos";
import MoyenPaiement from "./panel/MoyenPaiement";
import { useHistory } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { ThemeProvider } from "@emotion/react";
import { createTheme, responsiveFontSizes } from "@mui/material";

const drawerWidth = 240;
let TitleFont = createTheme({
  typography: {
    fontFamily: ["Amatic SC", "serif"].join(","),
    fontSize: 32,
  },
});
TitleFont = responsiveFontSizes(TitleFont);
export default function MonCompte(props) {
  const [route, setRoute] = useState("Mon compte");
  const history = useHistory();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout, isPending } = useLogout();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleRoute = (route) => {
    setRoute(route);
  };

  const drawer = (
    <div>
      <Box p={2} textAlign="center">
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => history.push("/")}
        >
          Retour au site
        </Button>
      </Box>
      <List>
        {[
          {
            text: "Mon compte",
            icon: <AccountCircleIcon />,
            route: "Mon compte",
          },
          {
            text: "Mes informations",
            icon: <BadgeOutlinedIcon />,
            route: "Mes informations",
          },
          {
            text: "Moyen de paiement",
            icon: <CreditCardIcon />,
            route: "Moyen de paiement",
          },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleRoute(item.route)}>
              <ListItemIcon
                sx={{
                  color: route === item.route ? "purple" : "none",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  textDecoration: route === item.route ? "underline" : "none",
                  color: route === item.route ? "purple" : "none",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box p={2} textAlign="center">
        <Button variant="contained" size="small" color="error" onClick={logout}>
          Déconnexion
        </Button>
      </Box>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "block" }}>
      <CssBaseline />
      <Box
        display="flex"
        pt={2}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <ThemeProvider theme={TitleFont}>
          <Box width="100%" textAlign="center">
            <Typography variant="h4" component="h1" fontWeight="bold">
              {route}
            </Typography>
          </Box>
        </ThemeProvider>
      </Box>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          p: 3,
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
          marginLeft: { xs: "0px", md: `${drawerWidth}px` },
        }}
      >
        {route === "Mon compte" ? <MyAccount /> : <></>}
        {route === "Mes informations" ? <MyInfos /> : <></>}
        {route === "Moyen de paiement" ? <MoyenPaiement /> : <></>}
      </Box>
    </Box>
  );
}
