import { Box,Typography } from "@mui/material"

export default function Avantages({backcolor,titre,sousTitre}) {
    return (
        <Box
              textAlign="center"
              width="auto"
              p={2}
              m={2}
              borderRadius="25px"
              sx={{ backgroundColor: {backcolor}, width: "100%" }}
            >
              <Typography fontWeight="bold" fontSize={22}>
                {titre}
              </Typography>
              <Typography>
                {sousTitre}
              </Typography>
            </Box>
    )
}
