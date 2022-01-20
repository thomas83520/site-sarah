import { PanierContext } from "../context/PanierContext";
import { useContext } from "react";

export const usePanierContext = () => {
  const context = useContext(PanierContext);

  if(!context){
      throw Error('useAuthContext must be inside an AuthContextProvider')
  }
  return context;
};
