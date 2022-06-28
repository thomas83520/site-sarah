import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Box } from "@mui/material";

//Components and pages
import MenuDisplay from "./components/Menu";
import HeaderDisplay from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/Contact/Contact";
import Distance from "./pages/Distance/Distance";
import Meeting from "./pages/Meeting/Meeting";
import Domicile from "./pages/Domicile/Domicile";
import Boutique from "./pages/Boutique/Boutique";
import Ebook from "./pages/Ebook_hiver/EbookHiver";
import BoiteMenu from "./pages/BoiteMenu/BoiteMenu";
import Login from "./pages/Login/Login";
import NewAccount from "./pages/NewAccount/NewAccount";
import Panier from "./pages/Panier/Panier";

import { useAuthContext } from "./hooks/useAuthContext";
import { usePanierContext } from "./hooks/usePanierContext";
import Cancel from "./pages/checkout/Cancel";
import Success from "./pages/checkout/Success";
import Checkout from "./pages/checkout/Checkout";
import MonCompte from "./pages/MonCompte/MonCompte";
import Terms from "./pages/Terms/Terms";

function App() {
  const { user, authIsReady } = useAuthContext();
  const { items } = usePanierContext();
  return (
    <div className="App">
      {authIsReady && (
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <BrowserRouter>
            <Switch>
              <>
                <Switch>
                  <Route path="/login" />
                  <Route path="/nouveauCompte" />
                  <Route path="/moncompte" />
                  <Route path="/">
                    <HeaderDisplay />
                    <MenuDisplay />
                  </Route>
                </Switch>

                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/login">
                  {user ? (
                    items.length > 0 ? (
                      <Redirect to="/panier" />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <Login />
                  )}
                </Route>
                <Route path="/nouveauCompte">
                  {user ? (
                    items.length > 0 ? (
                      <Redirect to="/panier" />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <NewAccount />
                  )}
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/domicile">
                  <Domicile />
                </Route>
                <Route path="/distance">
                  <Distance />
                </Route>
                <Route path="/meeting">
                  <Meeting />
                </Route>
                <Route path="/contact">
                  <Contact />
                </Route>
                <Route path="/boutique">
                  <Boutique />
                </Route>
                <Route path="/la_boite_a_menu">
                  <BoiteMenu />
                </Route>
                <Route path="/ebook_hiver">
                  <Ebook />
                </Route>
                <Route path="/panier">
                  <Panier />
                </Route>
                <Route path="/checkout">
                  {user ? <Checkout /> : <Redirect to="/" />}
                </Route>
                <Route path="/success">
                  <Success />
                </Route>
                <Route path="/cancel">
                  <Cancel />
                </Route>
                <Route path="/terms">
                  <Terms />
                </Route>
                <Route path="/moncompte">
                  {user ? <MonCompte /> : <Redirect to="/" />}
                </Route>
              </>
            </Switch>

            <Switch>
              <Route path="/login" />
              <Route path="/nouveauCompte" />
              <Route path="/moncompte" />
              <Route path="/">
                <Footer />
              </Route>
            </Switch>
          </BrowserRouter>
        </Box>
      )}
    </div>
  );
}

export default App;
