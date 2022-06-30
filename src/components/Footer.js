import { Instagram } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import BoxImage from "./BoxImage";

import { Divider, Link } from "@mui/material";
import React from "react";

import { Link as RouterLink } from "react-router-dom";

import FooterImage from "../assets/footer.jpg";

export default function Footer() {
  return (
    <Box
      width="100%"
      height={{ xs: 420, sm: 220, md: 180 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ position: "relative" }}
      mt="auto"
    >
      <BoxImage src={FooterImage} alt="Footer image" />
      <Grid container spacing={5} sx={{ position: "absolute" }}>
        <Grid item xs={12} sm={6} lg={3} textAlign="center">
          <Typography fontSize={18}>
            Consultations sur rendez-vous à domicile : Marseille et ses environs
            ou à distance
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} textAlign="center">
          <Typography fontSize={18}>Tél : 06 99 98 54 22</Typography>
          <Typography fontSize={18}>
            Mail : sarahroggi.dieteticienne@gmail.com
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} textAlign="center">
          <Instagram fontSize="large" />
          <Typography fontSize={18}>@sarah.dieteticienne</Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} textAlign="center">
          <Box>
            <Typography fontSize={18}>N° adeli : 139508790</Typography>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              underline="hover"
            >
              <Typography variant="subtitle2">
                Mentions légales & CGV
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
