import { useState, useEffect } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import {useFunctions} from './useFunctions';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch,reloadData } = useAuthContext();
  const { callfunction, response } = useFunctions();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      const response = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!response) {
        throw new Error("Could not complete signup");
      }

      //Add display name to user
      await response.user.updateProfile({ displayName });

      //TODO : Create stripe customer
      const stripeUser = await callfunction("createStripeCustomer",{email,displayName,userId : response.user.uid});
      //Dispatch login actionconst userDoc = await projectFirestore
      const userDoc =  await projectFirestore.collection("clients")
        .doc(response.user.uid)
        .get();
      dispatch({ type: "LOGIN", payload: userDoc.data() });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
      return true;
    } catch (e) {
      if (!isCancelled) {
        if (e.code === "auth/email-already-in-use") {
          setError("L'adresse mail est déjà utilisée.");
          setIsPending(false);
        }else if(e.code ==="auth/invalid-email"){
          setError("Votre email n'est pas valide.")
        }else{
          setError("Merci de réessayer ultérieurement");
          setIsPending(false);
        }
      }
      return false;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
