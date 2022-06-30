import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

export const PanierContext = createContext();

export const panierReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: action.payload };

    case "DELETE_ITEM":
      return { ...state, items: action.payload };

      case "CLEAN_PANIER":
        return {...state, items:[]};
    default:
      return state;
  }
};

export const PanierContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(panierReducer, {
    items:[]
  });

  return (
    <PanierContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PanierContext.Provider>
  );
};
