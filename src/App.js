import { BrowserRouter, Route, Switch } from "react-router-dom";

//Components and pages
import MenuDisplay from "./components/Menu";
import HeaderDisplay from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Meeting from "./pages/meeting/Meeting";
import Distance from "./pages/Distance/Distance";
import Domicile from "./pages/Domicile/Domicile";
import Boutique from "./pages/Boutique/Boutique";
import Ebook from "./pages/Ebook/Ebook";
import BoiteMenu from "./pages/BoiteMenu/BoiteMenu";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <>
            <HeaderDisplay />
            <MenuDisplay />

            <Route exact path="/">
              <Home />
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
            <Route path="/boutique">
              <Boutique />
            </Route>
            <Route path="/la_boite_a_menu">
              <BoiteMenu />
            </Route>
            <Route path="/ebook">
              <Ebook />
            </Route>
          </>
        </Switch>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
