import { projectFunctions } from "../firebase/config";
import { useReducer, useState, useEffect } from "react";

let initalState = {
  isPending: false,
  error: null,
  success: null,
  data: null,
};

const functionsReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        ...state,
        isPending: true,
        success: null,
        error: null,
      };
    case "SUCCESS":
      return {
        ...state,
        isPending: false,
        success: true,
        error: null,
        data: action.payload,
      };
    case "ERROR":
      return {
        ...state,
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

  const sendMail = async (functionName, functionData) => {
    dispatch({ type: "IS_PENDING" });
    try {
      var functions = projectFunctions.httpsCallable(functionName);
      const response = await functions(functionData);
      dispatchIfNotCancelled({ type: "SUCCESS", payload: response });
    } catch (e) {
      dispatchIfNotCancelled({ type: "ERROR", payload: e });
    }
  };

  const createStripeCheckout = async (functionName, functionData) => {
    dispatch({ type: "IS_PENDING" });
    try {
      var functions = projectFunctions.httpsCallable(functionName);
      const response = await functions(functionData);
      dispatchIfNotCancelled({ type: "SUCCESS", payload: response });
    } catch (e) {
      dispatchIfNotCancelled({ type: "ERROR", payload: e });
    }
  };

  const createOrder = async (items) => {
    dispatch({ type: "IS_PENDING" });
    try {
      var functions = projectFunctions.httpsCallable("createOrder");
      const response = await functions({ items: items });
      return response.data;
    } catch (e) {
      return;
    }
  };

  const createPortalSession = async () => {
    dispatch({ type: "IS_PENDING" });
    try {
      var functions = projectFunctions.httpsCallable("createPortalSession");
      const response = await functions();
      return response.data;
    } catch (e) {
      return;
    }
  };

  const callfunction = async (functionName, functionData) => {
    dispatch({ type: "IS_PENDING" });
    try {
      var functions = projectFunctions.httpsCallable(functionName);
      const response = await functions(functionData);
      dispatchIfNotCancelled({ type: "SUCCESS", payload: response.data });
      return response.data;
    } catch (e) {
      dispatchIfNotCancelled({ type: "ERROR", payload: e });
      return {error : true, message : "Erreur lors du paiement"}
    }
  };
  //clean up functions
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return {
    callfunction,
    sendMail,
    createStripeCheckout,
    createOrder,
    createPortalSession,
    response,
  };
};
