import { Box, ThemeProvider, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material";

const newtheme = createTheme({
  typography: {
    h6: {
      color: "#4F9092",
    },
  },
});

let TitleFont = createTheme({
  typography: {
    fontFamily: ["Patrick Hand", "serif"].join(","),
    fontSize: 15,
  },
});

TitleFont = responsiveFontSizes(TitleFont);

export default function SuiviWithSubtitle({
  title,
  subtitle,
  price,
  children,
}) {
  return (
    <ThemeProvider theme={newtheme}>
      <Box py={3}>
        <ThemeProvider theme={TitleFont}>
          <Box display="flex" justifyContent="space-evenly">
            <Typography variant="h4">{title}</Typography>
            <Typography variant="h4" fontWeight="bold" color="#4F9092">
              {price}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" textAlign="justify" color="#4F9092">
              {subtitle}
            </Typography>
          </Box>
        </ThemeProvider>
        <Box>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}
