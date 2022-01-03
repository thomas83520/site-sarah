import {Box,Grid} from '@mui/material'

export default function AboutDisplay({children}) {
    return (
        <Box mt={5} mb={5}>
        <Grid container direction={{ xs: "column", md: "row" }}>
          {children}
        </Grid>
      </Box>
    )
}
