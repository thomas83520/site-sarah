import { Box,Typography } from "@mui/material";
import BoxImage from "./BoxImage";

import BannerPhoto from '../assets/banner.jpg'

export default function Banner({title}) {
  return (
    <Box
      mt={2}
      width="100%"
      height={150}
      justifyContent="center"
      alignItems="center"
      display="flex"
      sx={{
        position:"relative"
      }}
    >
      <BoxImage src={BannerPhoto} alt='Banner'/>
      <Typography variant="h3" sx={{position:"absolute"}}>{title}</Typography>
    </Box>
  );
}
