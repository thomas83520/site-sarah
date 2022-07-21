import HeaderText from "../../components/HeaderText";

//Components
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";

//Hooks
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useHistory } from "react-router-dom";
import { projectAuth } from "../../firebase/config";

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

export default function Login() {
  const { login, isPending, error } = useLogin();
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [emailPasswordForget, setEmailPasswordForget] = useState("");
  const [emailPasswordForgetError, setemailPasswordForgetError] =
    useState(false);

  const validateEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      await projectAuth.sendPasswordResetEmail(emailPasswordForget);
      setSuccess(true);
      setSnackBarMessage(
        "Vous recevrez prochainement un mail pour réinitialiser votre mot de passe"
      );
    } catch (e) {
      console.log(e);
      setSuccess(false);
      setSnackBarMessage(
        "Une erreur s'est produite, merci de rééssayer ultérieurement!"
      );
    }
    setLoading(false);
    setOpen(true);
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setErrorText("");

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
    if (password === "") {
      setPasswordError(true);
      setErrorText("Renseignez un mot de passe");
      return;
    }

    login(email, password);

    setEmail("");
    setPassword("");
  };

  const handleCreateAccount = () => {
    history.push("/nouveauCompte");
  };

  return (
    <Container maxWidth="md">
      <HeaderText />

      <Container component="main" maxWidth="sm">
        {error ? (
          <Box>
            <Typography>Une erreur est survenue</Typography>
          </Box>
        ) : null}
        <Box
          display="block"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
          marginTop="20px"
        >
          <Typography variant="h4" component="h1" color="primary">
            Se connecter
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
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
              type="password"
              id="password"
              label="Mot de passe"
              name="motDePasse"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              error={passwordError}
              helperText={passwordError ? errorText : ""}
            />
            <Box width={1} display="flex" justifyContent="end">
              <Button onClick={()=>setOpenModal(true)}>Mot de passe oublié ?</Button>
            </Box>
            {isPending ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled
              >
                Loading..
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Se connecter
              </Button>
            )}
            <Box
              display="flex"
              textAlign="center"
              width={1}
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <Typography px={3}>Pas encore de compte ?</Typography>
              <Button onClick={handleCreateAccount}>Créer un compte</Button>
            </Box>
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
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Mot de passe oublié
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                color="primary"
                id="Confirmemail"
                label="Email du compte"
                name="confirmemail"
                onChange={(e) => setEmailPasswordForget(e.target.value)}
                value={emailPasswordForget}
                error={emailPasswordForgetError}
                helperText={emailPasswordForgetError ? errorText : ""}
              />
              <Box display="flex" justifyContent="space-evenly" pt={2}>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setOpenModal(false)}
                >
                  Annuler
                </Button>
                <Button variant="text" color="success" onClick={resetPassword}>
                  Envoyer
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Container>
  );
}
