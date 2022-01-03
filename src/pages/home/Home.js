import { Container } from "@mui/material";
import AboutPreview from "./AboutPreview";
import Citations from "./Citations";
import HomeContent from "./HomeContent";
import ImageDisplay from "./ImageDisplay";

export default function Home() {
  return (
    <div>
      <Container
        maxWidth="lg"
        sx={{ justifyContent: "center", padding: "20px" }}
      >
        <ImageDisplay/>
        <Citations/>
        <HomeContent/>
        <AboutPreview/>
      </Container>
    </div>
  );
}
