import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, reloadData } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    //sign the user out
    try {
      const response = await projectAuth.signInWithEmailAndPassword(
        email,
        password
      );

      //update login to true

      //dispatch logout action
      const userDoc = await projectFirestore
        .collection("clients")
        .doc(response.user.uid)
        .get();
      dispatch({ type: "LOGIN", payload: userDoc.data() });

      //update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (e) {
      if (!isCancelled) {
        setError(e.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};
