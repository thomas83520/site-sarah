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
import Ebook from "./pages/Ebook/Ebook";
import BoiteMenu from "./pages/BoiteMenu/BoiteMenu";
import Login from "./pages/Login/Login";
import NewAccount from "./pages/NewAccount/NewAccount";
import Panier from "./pages/Panier/Panier";

import { useAuthContext } from "./hooks/useAuthContext";
import Cancel from "./pages/checkout/Cancel";
import Success from "./pages/checkout/Success";

function App() {
  const { user, authIsReady } = useAuthContext();
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
                  <Route path="/">
                    <HeaderDisplay />
                    <MenuDisplay />
                  </Route>
                </Switch>

                <Route exact path="/">
                  <Home />
                </Route>
                {/*<Route path="/login">
                  {user ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/nouveauCompte">
                  {user ? <Redirect to="/" /> : <NewAccount />}
      </Route>*/}
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
                {/*<Route path="/boutique">
                  <Boutique />
                </Route>
                <Route path="/la_boite_a_menu">
                  <BoiteMenu />
                </Route>
                <Route path="/ebook">
                  <Ebook />
                </Route>
                <Route path="/panier">
                  <Panier />
                </Route>
                <Route path="/success">
                  <Success />
                </Route>
                <Route path="/cancel">
                  <Cancel />
                </Route>*/}
              </>
            </Switch>

            <Switch>
              <Route path="/login" />
              <Route path="/nouveauCompte" />
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
