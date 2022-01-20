import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    //sign the user out
    try {
      //set online to false
      const { uid } = user;

      //sign out from firebase
      await projectAuth.signOut();

      //dispatch logout action
      dispatch({ type: "LOGOUT" });

      //update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (e) {
      if (!isCancelled) {
        console.log(e.message);
        setError(e.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
