import {Box} from "@mui/material";

export default function BoxImage({src,alt}) {
    return (
        <Box
            sx={{ width:"100%",height:"100%",objectFit:"cover"}}
            component="img"
            src={src}
            alt={alt}
          />
    )
}
