import React, { useState, createContext, useEffect } from "react";

// Types
import { iGlobalValues } from "../Types/GlobalVarsTypes";

// Local Storage for persistent
const savedPage: number =
  JSON.parse(localStorage.getItem("ActivePage") as string) || 0;

const ContextGlobalVars = createContext<iGlobalValues | {}>({});
const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverErrMsg, setServerErrMsg] = useState("");
  const [closeNotice, setCloseNotice] = useState(false);

  const [refetchCreatorData, setRefetchCreatorData] = useState(false);
  const [activeComponent, setActiveComponent] = useState(savedPage); // Track the active component page index

  useEffect(() => {
    localStorage.setItem("ActivePage", JSON.stringify(activeComponent));
  }, [activeComponent]);

  return (
    <ContextGlobalVars.Provider
      value={{
        serverErrMsg,
        setServerErrMsg,
        refetchCreatorData,
        setRefetchCreatorData,
        closeNotice,
        setCloseNotice,
        activeComponent,
        setActiveComponent,
      }}>
      {children}
    </ContextGlobalVars.Provider>
  );
};

export { GlobalValuesProvider, ContextGlobalVars };
