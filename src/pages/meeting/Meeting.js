import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { useState } from "react";
import { useFunctions } from "../../hooks/useFunctions";
import SendIcon from "@mui/icons-material/Send";

export default function Meeting() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adresse, setAdresse] = useState("");
  const [motif, setMotif] = useState("");

  const [prenomError, setPrenomError] = useState(false);
  const [nomError, setNomError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [adresseError, setAdresseError] = useState(false);
  const [motifError, setMotifError] = useState(false);

  const [errorText, setErrorText] = useState("");

  const { sendMail, response } = useFunctions();

  const validateEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrenomError(false);
    setNomError(false);
    setEmailError(false);
    setPhoneNumberError(false);
    setAdresseError(false);
    setMotifError(false);
    setErrorText("");

    if (prenom === "") {
      setPrenomError(true);
      setErrorText("Prénom est vide");
      return;
    }
    if (nom === "") {
      setNomError(true);
      setErrorText("Nom est vide");
      return;
    }
    if (email === "") {
      setEmailError(true);
      setErrorText("Email est vide");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      setErrorText("Ceci n'est pas un email");
      return;
    }
    if (phoneNumber.length < 17) {
      setPhoneNumberError(true);
      setErrorText("Votre numéro est incorrect");
      return;
    }
    if (adresse === "") {
      setAdresseError(true);
      setErrorText("Adresse est vide");
      return;
    }
    if (motif === "") {
      setMotifError(true);
      setErrorText("Motif est vide");
      return;
    }

    const data = {
      completeName: prenom + " " + nom,
      prenom,
      nom,
      email,
      telephone: phoneNumber,
      adresse,
      motif,
    };
    console.log(data);
    await sendMail("sendContactMail", data);
  };

  return (
    <Box py={5}>
      <Container maxWidth="sm">
        <Typography variant="h5">Prenez rendez-vous ici :</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                color="primary"
                id="email"
                label="E-mail"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={emailError}
                helperText={emailError ? errorText : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MuiPhoneNumber
                defaultCountry={"fr"}
                onlyCountries={["fr"]}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                color="primary"
                id="phone"
                label="Numéro de téléphone"
                name="phone"
                onChange={(numero) => setPhoneNumber(numero)}
                value={phoneNumber}
                error={phoneNumberError}
                helperText={phoneNumberError ? errorText : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                color="primary"
                id="adresse"
                label="Adresse"
                name="adresse"
                onChange={(e) => setAdresse(e.target.value)}
                value={adresse}
                error={adresseError}
                helperText={adresseError ? errorText : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                color="primary"
                multiline
                rows="5"
                id="motif"
                label="Pour quel motif souhaitez-vous consulter ?"
                name="motif"
                onChange={(e) => setMotif(e.target.value)}
                value={motif}
                error={motifError}
                helperText={motifError ? errorText : ""}
              />
            </Grid>
            <Grid item xs={12}>
              {response.isPending ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled
                  endIcon={<SendIcon />}
                >
                  Loading..
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                >
                  Envoyer
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
