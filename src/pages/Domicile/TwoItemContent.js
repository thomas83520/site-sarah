import { Box, Grid, Typography } from "@mui/material";

export default function TwoItemContent({ children,prix }) {
  return (
    <Box my={3} pt={3}>
      <Grid container>
        {children}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: "flex",
            justifyContent: {xs:"center",md:"start"},
            alignItems: "center",
          }}
        >
          <Box
            borderRadius="50%"
            height={200}
            width={200}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            display="flex"
            sx={{ backgroundColor: "lightgray" }}
          >
            <Typography fontSize={40}>{prix}</Typography>
            <Typography>Chèques ou espèces</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
