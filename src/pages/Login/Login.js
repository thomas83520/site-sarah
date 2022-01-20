import HeaderText from "../../components/HeaderText";

//Components
import { Container, Box, TextField, Typography, Button } from "@mui/material";

//Hooks
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useHistory } from "react-router-dom";

//assets & icons
import SendIcon from "@mui/icons-material/Send";

export default function Login() {
  const { login, isPending, error } = useLogin();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const validateEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
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

  const handleCreateAccount = ()=>{
    history.push("/nouveauCompte");
  }

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
            <Box display="flex" textAlign="center" width={1} justifyContent="center" alignItems="center" py={3}>
              <Typography px={3}>Pas encore de compte ?</Typography>
              <Button onClick={handleCreateAccount}>Créer un compte</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
