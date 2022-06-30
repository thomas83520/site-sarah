import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectAuth } from "../../../firebase/config";

export default function MyInfos() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    try {
      await projectAuth.sendPasswordResetEmail(user.email);
      setSuccess(true);
    } catch (e) {
      setSuccess(false);
    }
    setLoading(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  return (
    <Container maxWidth="xs">
      <Box width="100%" margin="auto">
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography>Nom :</Typography>
          <Typography>{user.name}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography>Email :</Typography>
          <Typography>{user.email}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography>Mot de passe :</Typography>
          {loading ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={resetPassword}
              disabled
            >
              Envoie en cours
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={resetPassword}
            >
              Modifier mot de passe
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        key="Snackbar"
        autoHideDuration={5000}
      >
        {success ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Vous recevrez prochainement un mail pour réinitialiser votre mot de passe
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Une erreur s'est produite, merci de rééssayer ultérieurement!
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
