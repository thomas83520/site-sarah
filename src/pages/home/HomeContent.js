import { Box, Typography } from "@mui/material";

const objectifs = [
  "- vous réapprendre à manger et retrouver un bien-être grâce à une alimentation plus saine, équilibrée et pleine de plaisirs",
  "- vous conseiller sur les points essentiels à revoir concernant votre alimentation ",
  "-vous accompagner tout au long du suivi afin d'acquérir une autonomie et de bonnes habitudes sur le long terme",
];

const forWho = [
  "Pour toute personne bien portante à tout âge de la vie (enfant, adolescent, adultes et seniors)",
  "La femme à chaque étape de sa féminité (grossesse, allaitement, ménopause...)",
  "Les personnes souffrant d'un mal-être ou d'une pathologie (obésité, diabète, maladies cardio-vasculaires, maladies inflammatoires chroniques de l'intestin, dénutrition, intolérances ou allergies...) ",
];

export default function HomeContent() {
  return (
    <Box mt={3}>
      <Typography variant="h6" fontWeight="bold" mt={2} mb={2}>Pourquoi consulter une diététicienne ?</Typography>
      <Typography textAlign="justify">
        Que vous veniez sous prescription médicale ou de votre propre
        initiative, les consultations diététiques vont vous aider à améliorer
        votre alimentation afin de répondre à un besoin précis. Je vous donnerai
        un avis professionnel sur vos habitudes alimentaires et je serai à votre
        écoute pour retrouver forme et équilibre dans votre vie.
      </Typography>
      <Typography fontWeight="bold">Mes objectifs avec vous seront les suivants : </Typography>
      {objectifs.map((objectif) => (
        <Typography key={objectif}>{objectif}</Typography>
      ))}
      <Typography variant="h6" fontWeight="bold" mt={2} mb={2}>Pour QUI ?</Typography>
      {forWho.map(text=><Typography key={text}>{text}</Typography>)}
    </Box>
  );
}
