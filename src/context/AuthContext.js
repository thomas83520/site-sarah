import { createContext, useEffect, useReducer } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await projectFirestore
          .collection("clients")
          .doc(user.uid)
          .get();
        dispatch({ type: "AUTH_IS_READY", payload: userDoc.data() });
      } else dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  const reloadData = async () => {
    if (state.user) {
      const userDoc = await projectFirestore
        .collection("clients")
        .doc(state.user.uid)
        .get();
      dispatch({ type: "AUTH_IS_READY", payload: userDoc.data() });
    } else dispatch({ type: "AUTH_IS_READY", payload: state.user });
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch,reloadData }}>
      {children}
    </AuthContext.Provider>
  );
};
