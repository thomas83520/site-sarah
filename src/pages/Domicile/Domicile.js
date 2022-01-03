import { Box,Container } from "@mui/material";
import Banner from '../../components/Banner'
import DomicileContent from "./DomicileContent";

export default function Domicile() {
    return (
        <Box>
            <Banner title="Consultations /tarifs"/>
            <Container maxWidth="lg">
            <DomicileContent/>
            </Container>
        </Box>
    )
}
