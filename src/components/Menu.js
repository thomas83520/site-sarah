import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";
import { NavLink,useLocation } from "react-router-dom";

const pages = [
  { label: "Accueil", route: "/" },
  { label: "À propos", route: "/about" },
  { label: "Consultations à domicile", route: "/domicile" },
  { label: "Suivi à distance", route: "/distance" },
  { label: "Prendre RDV", route: "/meeting" },
  { label: "Contact", route: "/contact" },
  {label: "Boutique", route: "/boutique"}
];

const LinkBehavior = React.forwardRef((props, ref) => {
  return (
    <NavLink
      exact
      ref={ref}
      {...props}
      activeStyle={{
        color: "black",
      }}
    />
  );
});

export default function MenuDisplay() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const {location}=useLocation();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
   <Container
      maxWidth={false}
      sx={{
        borderTop: { md: "1px solid lightgrey", xs: "" },
        borderBottom: { md: "1px solid lightgrey", xs: "" },
      }}
    >
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                <Button
                size="small"
                  LinkComponent={LinkBehavior}
                  to={page.route}
                  key={page.label}
                  onClick={handleCloseNavMenu}
                  activeClassName="selected"
                  sx={{ my: 2, color: "black" }}
                >
                  {page.label}
                </Button>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box
          sx={{
            justifyContent: "space-evenly",
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          {pages.map((page) => (
            <Button
              LinkComponent={LinkBehavior}
              to={page.route}
              key={page.label}
              onClick={handleCloseNavMenu}
              activeClassName="selected"
              sx={{ my: 2, color: "gray" }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </Container>
  );
}
