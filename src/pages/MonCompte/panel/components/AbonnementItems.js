import {
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
  responsiveFontSizes,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { projectFirestore, projectStorage } from "../../../../firebase/config";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useFunctions } from "../../../../hooks/useFunctions";

import { ThemeProvider } from "@emotion/react";
import { myAccountAboName, myAccountAboPart } from "../../../../constants";

export default function AbonnementItems({ doc }) {
  const { user } = useAuthContext();
  const [limit, setLimit] = useState(2);
  const [asMore, setAsMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [receivedDocuments, setReceivedDocuments] = useState(null);
  const { callfunction, response } = useFunctions();

  useEffect(() => {
    const getReceivedDoc = async () => {
      const snapshot = await projectFirestore
        .collection("clients")
        .doc(user.userId)
        .collection("achats")
        .doc(doc.id)
        .collection("docs")
        .limit(limit)
        .get();
      if (snapshot.size < limit) setAsMore(false);
      setReceivedDocuments(snapshot.docs);
    };

    getReceivedDoc();
  }, []);

  const handleLoadMore = async (lastDoc) => {
    const snapshot = await projectFirestore
      .collection("clients")
      .doc(user.userId)
      .collection("achats")
      .doc(doc.id)
      .collection("docs")
      .limit(limit)
      .startAfter(lastDoc)
      .get();
    if (snapshot.size < limit) setAsMore(false);
    setReceivedDocuments(receivedDocuments.concat(snapshot.docs));
  };

  const handleAbonnementChange = async () => {
    const result = await callfunction("switchAbonnementCancelStatus", {
      subscriptionId: doc.subscriptionId,
      value: !doc.isCancel,
      productId: doc.id,
      userId: user.userId,
    });
    if (result.success) setSuccess(true);
    else setSuccess(false);

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleImageClicked = async (imageBucketFileName) => {
    const url = await projectStorage.ref(imageBucketFileName).getDownloadURL();
    window.open(url, "_blank").focus();
  };
  return (
    <Box px={2}>
      {receivedDocuments && (
        <Box>
          <ThemeProvider theme={responsiveFontSizes(myAccountAboName)}>
            <Typography color="primary" variant="h5" pb={1}>
              {doc.name}
            </Typography>
          </ThemeProvider>
          <Box px={2}>
            <ThemeProvider theme={responsiveFontSizes(myAccountAboPart)}>
              <Typography color="primary" variant="h6">
                Mes documents reçus
              </Typography>
            </ThemeProvider>
            <Box textAlign="center">
              {receivedDocuments.length > 0 ? (
                <Grid container>
                  {receivedDocuments.map((docReceived) => (
                    <Grid
                      key={docReceived.id}
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      xl={3}
                    >
                      <Box p={2}>
                        <Box
                          onClick={() =>
                            handleImageClicked(
                              docReceived.data().bucketFileName
                            )
                          }
                          sx={{
                            verticalAlign: "middle",
                            transition: "transform .2s",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            height={250}
                            src={docReceived.data().imageCouverture}
                            alt="Image"
                            sx={{
                              verticalAlign: "middle",
                              transition: "transform .2s",
                              "&:hover": {
                                opacity: 0.8,
                              },
                            }}
                          />
                          <Typography>{docReceived.data().fileName}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  {asMore && (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                      <Box
                        display="flex"
                        height="100%"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button
                          onClick={() =>
                            handleLoadMore(
                              receivedDocuments[receivedDocuments.length - 1]
                            )
                          }
                        >
                          Charger plus de documents
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Box textAlign="center">
                  <Typography variant="caption">
                    Aucun document reçu pour le moment.
                  </Typography>
                </Box>
              )}
            </Box>
            <Box py={1}>
              <ThemeProvider theme={responsiveFontSizes(myAccountAboPart)}>
                <Typography color="primary" variant="h6">
                  Gérer mon abonnement
                </Typography>
              </ThemeProvider>
              <Box px={2}>
                <Box display="flex">
                  <Typography fontWeight="bold" mr={1}>
                    Formule d'abonnement :{" "}
                  </Typography>
                  <Typography fontWeight="bold">{doc.nomFormule}</Typography>
                </Box>
                <Box display="flex">
                  <Typography mr={1}>Prochaine échéance : </Typography>
                  <Typography>
                    le {" "}
                    {doc.status === "canceled"
                      ? "Abonnement terminé"
                      : doc.nextPeriod.toDate().toLocaleDateString("fr")}
                  </Typography>
                </Box>
                {doc.status === "canceled" ? (
                  <Typography>
                    Votre abonnement est terminé. Vous ne serez plus prélevé.
                  </Typography>
                ) : doc.canCancel ? (
                  response.isPending ? (
                    <Button
                      color="success"
                      type="text"
                      disabled
                      onClick={() => handleAbonnementChange()}
                    >
                      Modification en cours
                    </Button>
                  ) : doc.isCancel ? (
                    <Button
                      color="success"
                      type="text"
                      onClick={() => handleAbonnementChange()}
                    >
                      Réactiver mon abonnement
                    </Button>
                  ) : (
                    <Button
                      color="error"
                      type="text"
                      onClick={() => handleAbonnementChange()}
                    >
                      Annuler mon abonnement
                    </Button>
                  )
                ) : (
                  <Typography>
                    Votre abonnement s'arretera automatiquement à la fin de la
                    période
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key="Snackbar"
        autoHideDuration={3000}
      >
        {success ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            Changement pris en compte, vous recevrez prochainement un mail de
            confirmation !
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
    </Box>
  );
}
