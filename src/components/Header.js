import { Box, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useHistory } from "react-router-dom";
import HeaderText from "./HeaderText";
import { usePanierContext } from "../hooks/usePanierContext";

export default function HeaderDisplay() {
  const { user } = useAuthContext();
  const { items } = usePanierContext();
  const history = useHistory();
  const { logout, isPending } = useLogout();

  const handleClick = (page) => {
    history.push(page);
  };

  return (
    <Box position="relative" width="auto">
      <HeaderText />
      <Box
        position="absolute"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          top: "5%",
          right: "1%",
          transform: "translate(0%,0%)",
        }}
      >
        {!user ? (
          <>
            <Button
              onClick={() => handleClick("/panier")}
              endIcon={<ShoppingCartIcon />}
            >
              Panier {items.length > 0 ? `(${items.length})` : null}
            </Button>
            <Box mx={2}>
              <Button onClick={() => handleClick("/login")}>Login</Button>
            </Box>
            <Button
              onClick={() => handleClick("/nouveauCompte")}
              variant="outlined"
              size="small"
            >
              Créer un compte
            </Button>
          </>
        ) : (
          <>
            <Box mx={2}>
              <Button
                onClick={() => handleClick("/panier")}
                endIcon={<ShoppingCartIcon />}
              >
                Panier {items.length > 0 ? `(${items.length})` : null}
              </Button>
            </Box>
            <Box mx={2}>
              <Button
                onClick={() => handleClick("/monEspace")}
                variant="outlined"
                size="small"
              >
                Mon espace
              </Button>
            </Box>
            {isPending ? (
              <Button onClick={null} variant="outlined" size="small" disabled>
                Déconnexion..
              </Button>
            ) : (
              <Button
                onClick={logout}
                variant="outlined"
                size="small"
                color="error"
              >
                Se déconnecter
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
