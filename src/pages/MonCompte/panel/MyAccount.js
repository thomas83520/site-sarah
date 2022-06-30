import { Grid, Typography, Button, responsiveFontSizes } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase/config";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useFunctions } from "../../../hooks/useFunctions";
import AbonnementItems from "./components/AbonnementItems";
import FacturesDisplay from "./components/FacturesDisplay";
import { useCollection } from "../../../hooks/useCollections";
import { ThemeProvider } from "@emotion/react";
import { myAccountPartTitle } from "../../../constants";

export default function MyAccount() {
  const { user } = useAuthContext();
  const [oneTimePurchase, setOneTimePurchase] = useState(null);
  const [factures, setFactures] = useState(null);
  const [asMore, setAsMore] = useState(true);
  const [abonnements, setAbonnements] = useState(null);
  const { callfunction } = useFunctions();
  const { error, documents } = useCollection(`clients/${user.userId}/achats`);
  const limit = 2;

  //get one time purchase item
  useEffect(() => {
    const foo = async () => {
      const snapshot = await projectFirestore
        .collection("clients")
        .doc(user.userId)
        .collection("achats")
        .doc("oneTimePurchase")
        .collection("docs")
        .limit(limit)
        .get();
      setOneTimePurchase(snapshot.docs);
    };
    foo();
  }, []);

  useEffect(() => {
    const foo = async () => {
      const result = await callfunction("getFactures", {
        customerId: user.customerId,
      });
      setFactures(result);
    };
    foo();
  }, []);

  useEffect(() => {
    if (documents) {
      const result = documents.filter((doc) => doc.id !== "oneTimePurchase");
      setAbonnements(result);
    }
  }, [documents]);

  const handleLoadMore = async (lastDoc) => {
    const snapshot = await projectFirestore
      .collection("clients")
      .doc(user.userId)
      .collection("achats")
      .doc("oneTimePurchase")
      .collection("docs")
      .limit(limit)
      .startAfter(lastDoc)
      .get();
    if (snapshot.size < limit) setAsMore(false);
    setOneTimePurchase(oneTimePurchase.concat(snapshot.docs));
  };

  const handleImageClicked = (imageUrl) => {
    
    window.open(imageUrl, "_blank").focus();
  };
  return (
    <Box>
      {oneTimePurchase && (
        <Box mb={1}>
          <ThemeProvider theme={responsiveFontSizes(myAccountPartTitle)}>
            <Typography variant="h4" color="primary" py={2}>
              Mes achats unique
            </Typography>
          </ThemeProvider>
          {oneTimePurchase.length > 0 ? (
            <Box textAlign="center">
              <Grid container spacing={5}>
                {oneTimePurchase.map((doc) => (
                  <Grid item xs={12} md={6} lg={4} xl={3} key={doc.id}>
                    <Box
                      onClick={() => handleImageClicked(doc.data().productUrl)}
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
                        src={doc.data().imageCouverture}
                        alt="Image"
                        sx={{
                          verticalAlign: "middle",
                          transition: "transform .2s",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                      />
                      <Typography>{doc.data().name}</Typography>
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
                            oneTimePurchase[oneTimePurchase.length - 1]
                          )
                        }
                      >
                        Charger plus de documents
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="caption">
                Aucun achat unqiue pour le moment
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {abonnements &&
        (abonnements.length > 0 ? (
          <Box my={5}>
            <ThemeProvider theme={responsiveFontSizes(myAccountPartTitle)}>
              <Typography variant="h4" color="primary" py={2}>
                Mes abonnements
              </Typography>
            </ThemeProvider>
            {abonnements.map((doc) => (
              <AbonnementItems key={doc.id} doc={doc} />
            ))}
          </Box>
        ) : (
          <></>
        ))}
      {factures && (
        <Box>
          <ThemeProvider theme={responsiveFontSizes(myAccountPartTitle)}>
            <Typography variant="h4" color="primary" py={2}>
              Factures
            </Typography>
          </ThemeProvider>
          {factures.length > 0 ? (
            <FacturesDisplay factures={factures} />
          ) : (
            <Box textAlign="center">
              <Typography variant="caption">
                Aucun achat pour le moment.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
