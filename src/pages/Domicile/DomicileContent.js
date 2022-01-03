import TwoItemContent from "./TwoItemContent";
import { Grid, Typography, Box } from "@mui/material";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const deroulement = [
  "- vous me parlez de vous de manière générale : votre rythme de vie, vos objectifs, vos antécédents, vos contraintes, vos loisirs etc",
  "- Puis nous parlons un plus en détail de vos habitudes alimentaires, vous me racontez votre histoire avec l'alimentation ce qui me permettra de mieux cerner vos besoins et de vous proposer un plan alimentaire personnalisé. ",
  "- Nous passons ensuite aux mesures et à la pesée (pas obligatoires)",
  "- Nous fixons les premiers objectifs ensembles et je vous remets un plan alimentaire en fonction de tout ce qui aura été évoqué, lequel pourra éventuellement évoluer au fil des consultations. ",
  "- A la fin du rendez-vous, vous disposerez des premiers documents qui vous permettront de mettre en pratique les conseils donnés. ",
];

const pointSuivi = [
  "Elles durent en moyenne 30 minutes.",
  "- Nous faisons le point sur les semaines passées, les difficultés rencontrées, j'analyse votre journal alimentaire et nous réajustons ensemble le plan diététique si besoin.",
  "- Nous réaliserons un bilan corporel pour apprécier votre évolution (pas obligatoire)",
  "- Nous anticipons les semaines à venir en fixant de nouveaux objectifs",
  "- Nous abordons ensemble des sujets particuliers en fonction de vos attentes (choix des matières grasses, étiquetage nutritionnel etc)",
];

const mutuelles = [
  "AGF et ALLIANZ : Forfait selon garantie et contrat de 100 à 200 euros par an.",
  "Apicil : Selon les contrats, jusqu’à 6 consultations par an et par personne.",
  "April Santé : Selon les contrats de 30 à 200 euros par an.",
  "MAAF : Remboursement plafonné à 90 euros par an.",
  "AXA assurance : 75 euros par an dans le forfait « médecine douce ».",
  "SMEREP : 1 consultation par an.",
  "UNEO : 3 consultations par an.",
  "Crédit mutuel : 100 euros par an.",
  "...",
];

export default function DomicileContent() {
  return (
    <Box>
      <TwoItemContent prix="50€">
        <Grid item xs={12} md={9} px={{md:10}}>
          <Typography variant="h6" pb={3} fontWeight="bold">
            LE BILAN DIÉTÉTIQUE (1ÈRE CONSULTATION)
          </Typography>
          <Typography textAlign="justify">
            La première consultation diététique dure en moyenne 1 heure. Ce
            premier entretien nous permet de faire connaissance, discuter de vos
            attentes, vos objectifs et vos craintes. Il me permet de comprendre
            vos habitudes alimentaires et d'en faire une analyse complète afin
            de vous proposer la prise en charge la mieux adaptée.{" "}
          </Typography>
          <Typography pt={1}>
            Ce premier bilan se déroulera de la manière suivante :
          </Typography>
          {deroulement.map((etape) => (
            <Typography key={etape}>{etape}</Typography>
          ))}
        </Grid>
      </TwoItemContent>
      <TwoItemContent prix="35€">
        <Grid item xs={12} md={9} px={{md:10}}>
          <Typography variant="h6" pb={3} fontWeight="bold">
            LES CONSULTATIONS DE SUIVI
          </Typography>
          {pointSuivi.map((etape) => (
            <Typography key={etape}>{etape}</Typography>
          ))}
          <Typography variant="h6" pt={5}>Bon à savoir:</Typography>
          <Typography textAlign="justify">
            Je propose un tarif réduit pour les étudiants, -5€ sur le bilan
            diététique et les consultations de suivi sur présentation de la
            carte étudiante. Cette réduction s'applique également pour les
            enfants et les demandeurs d'emploi (justificatif à l'appui).{" "}
          </Typography>
        </Grid>
      </TwoItemContent>
      <Grid container>
        <Grid item xs={12} md={9} px={{md:10}} pb={5}>
          <Typography fontWeight="bold" py={2}>
            Les consultations à domicile en dehors du 5 ème et 6 ème arrondissement de Marseille
            peuvent donner lieu à un supplément afin de prendre en charge le
            déplacement. Je vous signalerai ce montant dès la prise de
            rendez-vous.
          </Typography>

          <Typography variant="h6" py={3} fontWeight="bold">
            REMBOURSEMENT DE L'ACTE DIÉTÉTIQUE
          </Typography>
          <Typography textAlign="justify">
            La consultation diététique n'est pas remboursée par la sécurité
            sociale. Cependant, de nombreuses mutuelles proposent une prise en
            charge partielle :
          </Typography>
          {mutuelles.map((mutuelle) => (
            <Box display="flex" alignItems="center" pl={{md:2}} key={mutuelle}>
                <CircleRoundedIcon sx={{ fontSize: 10 }} />
                <Typography pl={2}>{mutuelle}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
