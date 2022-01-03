import { projectFunctions } from "../firebase/config";
import { useReducer, useState,useEffect } from "react";

let initalState = {
  isPending: false,
  error: null,
  success: null,
};

const functionsReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        isPending: true,
        success: null,
        error: null,
      };
    case "SUCCESS":
      return {
        isPending: false,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        success: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFunctions = () => {
  const [response, dispatch] = useReducer(functionsReducer, initalState);
  const [isCancelled, setIsCancelled] = useState(false);

  //only if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  const sendMail = async (functionName,functionData) => {
    dispatch({ type: "IS_PENDING" });
    try {
        console.log('try')
        var functions = projectFunctions.httpsCallable(functionName);
        console.log("func");
      const response = await functions(functionData);
      console.log("response",response);
      dispatchIfNotCancelled({ type: "SUCCESS" });
    } catch (e) {
      console.log("error",e);
      dispatchIfNotCancelled({ type: "ERROR", payload: e });
    }
  };
  //clean up functions
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { sendMail, response };
};
