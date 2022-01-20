import { Delete } from "@mui/icons-material";
import { Container, IconButton, Typography, Box } from "@mui/material";
import { usePanierContext } from "../../hooks/usePanierContext";

export default function PanierItem({ item }) {
  const { items, dispatch } = usePanierContext();

  const handleClick = () => {
    dispatch({
      type: "DELETE_ITEM",
      payload: items.filter((panieritem) => panieritem.nom !== item.nom),
    });
  };

  return (
    <Box
      m={5}
      display="flex"
      justifyContent="space-between"
      textAlign="center"
      alignItems="center"
      p={3}
      width={1}
      sx={{ backgroundColor: "white" }}
      borderRadius="10px"
    >
      <Box textAlign="start">
        <Typography variant="h5" fontWeight="bold">
          {item.nom}
        </Typography>
        <Typography variant="subtitle2">{item.infoText}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6">{item.textPrix}</Typography>
        <IconButton onClick={handleClick}>
          <Delete color="error" />
        </IconButton>
      </Box>
    </Box>
  );
}
