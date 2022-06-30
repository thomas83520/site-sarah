import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectAuth } from "../../../firebase/config";
import { useFunctions } from "../../../hooks/useFunctions";
import EditIcon from "@mui/icons-material/Edit";
import { useLogout } from "../../../hooks/useLogout";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};

export default function MyInfos() {
  const { user, reloadData } = useAuthContext();
  const { logout } = useLogout();
  const { callfunction } = useFunctions();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailConfirmError, setEmailConfirmError] = useState(false);
  const [logoutAccount, setLogoutAccount] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    try {
      await projectAuth.sendPasswordResetEmail(user.email);
      setSuccess(true);
      setSnackBarMessage(
        "Vous recevrez prochainement un mail pour réinitialiser votre mot de passe"
      );
    } catch (e) {
      setSuccess(false);
      setSnackBarMessage(
        "Une erreur s'est produite, merci de rééssayer ultérieurement!"
      );
    }
    setLoading(false);
    setOpen(true);
  };
  const validateEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  };
  const updateEmail = async () => {
    setEmailError(false);
    setEmailConfirmError(false);
    setErrorText("");

    setLoadingEmail(true);

    if (email === "") {
      setEmailError(true);
      setErrorText("Renseignez un email");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      setErrorText("Ceci n'est pas un email");
      return;
    }
    if (email !== emailConfirm) {
      setEmailConfirmError(true);
      setEmailError(true);
      setErrorText("Les emails ne correspondent pas.");
      return;
    }

    const result = await callfunction("updateMail", {
      email,
      userId: user.userId,
      customerId: user.customerId,
    });

    if (result.success) {
      setSuccess(true);
      setSnackBarMessage(
        "Votre email à bien été changé. Merci de vous reconnecter avec votre nouvelle adresse mail."
      );
      setLogoutAccount(true);
    } else {
      setSuccess(false);
      setLogoutAccount(false);
      if (result.message.errorInfo.code === "auth/email-already-exists")
        setSnackBarMessage("Cet email est déjà utilisé");
      else setSnackBarMessage("Une erreur est survenue");
    }
    setLoadingEmail(true);
    handleCloseModal();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    if (logoutAccount) logout();
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setLoadingEmail(false);
  };
  return (
    <Container maxWidth="xs">
      <Box width="100%" margin="auto">
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography>Nom :</Typography>
          <Typography>{user.name}</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ alignItems: "center" }}
          p={2}
        >
          <Typography>Email :</Typography>
          <Typography>{user.email}</Typography>
          {loadingEmail ? (
            <CircularProgress color="inherit" size={25} />
          ) : (
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => setOpenModal(true)}
            >
              <EditIcon />
            </IconButton>
          )}
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
            {snackbarMessage}
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        )}
      </Snackbar>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Changer votre adresse mail
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              color="primary"
              id="email"
              label="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={emailError}
              helperText={emailError ? errorText : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              color="primary"
              id="Confirmemail"
              label="confirmation email"
              name="confirmemail"
              onChange={(e) => setEmailConfirm(e.target.value)}
              value={emailConfirm}
              error={emailConfirmError}
              helperText={emailConfirmError ? errorText : ""}
            />
            <Box display="flex" justifyContent="space-evenly" pt={2}>
              <Button
                variant="text"
                color="error"
                onClick={() => setOpenModal(false)}
              >
                Annuler
              </Button>
              <Button variant="text" color="success" onClick={updateEmail}>
                Modifier
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
