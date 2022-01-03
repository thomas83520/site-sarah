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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderDisplay />
        <MenuDisplay />

        <Switch>
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
        </Switch>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
