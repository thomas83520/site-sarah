import { Grid, Box } from "@mui/material";

//image
import Image1 from "../../assets/IMG1.jpg";
import Image2 from "../../assets/IMG2.jpg";
import Image3 from "../../assets/IMG3.jpg";
import Image4 from "../../assets/IMG4.jpg";
import Image5 from "../../assets/IMG5.jpg";
import Image6 from "../../assets/IMG6.jpg";

export default function ImageDisplay() {
  return (
    <Grid container spacing={1} justifyContent="center">
      <Box
        component={Grid}
        item
        md={2}
        sm={4}
        xs={6}
        display={{ xs: "none", sm: "block" }}
        sx={{textAlign:'center'}}
      >
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image1}
        ></Box>
      </Box>
      <Box
        component={Grid}
        item
        md={2}
        sm={4}
        xs={6}
        display={{ xs: "none", sm: "block" }}
        sx={{textAlign:'center'}}
      >
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image2}
        ></Box>
      </Box>
      <Box component={Grid} justifyContent='center' sx={{textAlign:'center'}}item sm={4} md={2} xs={6}>
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image3}
        ></Box>
      </Box>
      <Box component={Grid} sx={{textAlign:'center'}} item md={2} sm={4} xs={6}>
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image4}
        ></Box>
      </Box>
      <Box component={Grid} sx={{textAlign:'center'}} item md={2} sm={4} xs={6}>
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image5}
        ></Box>
      </Box>
      <Box component={Grid}  sx={{textAlign:'center'}} item md={2} sm={4} xs={6}>
        <Box
          component="img"
          height={200}
          alt="Photo numéro 1"
          src={Image6}
        ></Box>
      </Box>
    </Grid>
  );
}
