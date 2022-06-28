import HeaderText from "../../components/HeaderText";

//Components
import { Container, Box, TextField, Typography, Button } from "@mui/material";

//Hooks
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useHistory } from "react-router-dom";

//assets & icons
import SendIcon from "@mui/icons-material/Send";

export default function NewAccount() {
  const { signup, isPending, error } = useSignup();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [nomError, setNomError] = useState(false);
  const [prenomError, setPrenomError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const validateEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  };
  const validatePassword = (password) => {
    return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmPasswordError(false);
    setEmailError(false);
    setPasswordError(false);
    setNomError(false);
    setPrenomError(false);
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
    if (!validatePassword(password)) {
      setPasswordError(true);
      setErrorText("Le mot de passe ne correspond pas aux critères");
      return;
    }
    if (confirmPassword === "") {
      setConfirmPasswordError(true);
      setErrorText("Confirmez votre mot de passe");
      return;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError(true);
      setPasswordError(true);
      setErrorText("Mot de passe différents");
      return;
    }
    if (nom === "") {
      setNomError(true);
      setErrorText("Renseignez votre nom");
      return;
    }
    if (prenom === "") {
      setPrenomError(true);
      setErrorText("Renseignez votre prénom");
      return;
    }

    let displayName = nom + " " + prenom;

    const signupOK = await signup(email, password, displayName);

    if (signupOK) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNom("");
      setPrenom("");
    }
  };

  const handleLogin = () => {
    history.push("/login");
  };

  return (
    <Container maxWidth="md">
      <HeaderText />

      <Container component="main" maxWidth="sm">
        <Box
          display="block"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
          marginTop="20px"
        >
          <Typography variant="h4" component="h1" color="primary">
            Nouveau Compte :
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
            <Box textAlign="start">
              <Typography variant="subtitle2">
                Votre mot de passe doit :
              </Typography>
              <Typography variant="subtitle2">
                {" "}
                - Faire plus de 6 caratcères de long{" "}
              </Typography>
              <Typography variant="subtitle2">
                {" "}
                - Contenir au minimum 1 majuscule et 1 minuscule
              </Typography>
              <Typography variant="subtitle2">
                {" "}
                - Contenir au moins 1 chiffre
              </Typography>
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              color="primary"
              type="password"
              id="confirmPassword"
              label="Confirmez votre mot de passe"
              name="confirmMotDePasse"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? errorText : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              color="primary"
              id="nom"
              label="Nom"
              name="nom"
              onChange={(e) => setNom(e.target.value)}
              value={nom}
              error={nomError}
              helperText={nomError ? errorText : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              color="primary"
              id="prenom"
              label="Prénom"
              name="prenom"
              onChange={(e) => setPrenom(e.target.value)}
              value={prenom}
              error={prenomError}
              helperText={prenomError ? errorText : ""}
            />
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
                Créer son compte
              </Button>
            )}
            {error ? (
              <Box>
                <Typography color="error">
                  Une erreur est survenue : {error}
                </Typography>
              </Box>
            ) : null}
            <Box
              display="flex"
              textAlign="center"
              width={1}
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <Typography px={3}>Vous avez déjà compte ?</Typography>

              <Button onClick={handleLogin}>Se connecter</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
