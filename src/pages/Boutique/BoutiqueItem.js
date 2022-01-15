import { Box, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function BoutiqueItem({ image, title, prix, path }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(path);
  };
  return (
    <Box py={10}>
      <Box >
        <Box position="relative">
          <Box
            onClick={handleClick}
            component="img"
            height={380}
            alt="Image objet en vente"
            src={image}
            sx={{ verticalAlign: "middle" }}
          />
          <Box
            position="absolute"
            sx={{
              background: "rgba(219, 219, 219, 0.9)",
              top: "100%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <Typography p={1}>{title}</Typography>
          </Box>
        </Box>

        <Typography pt={5}>{prix}</Typography>
      </Box>
    </Box>
  );
}
