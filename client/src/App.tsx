import React from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";

import { AuthProvider } from "./Context/AuthProvider";
// import { GlobalValuesProvider } from "./Context/globalVars";
// import { GlobalDataProvider } from "./Context/globalData";

const App = () => {
  return (
    <div className='App'>
      <AuthProvider>
        {/* <GlobalValuesProvider> */}
        {/* <GlobalDataProvider> */}
        <LaRoutes />
        {/* </GlobalDataProvider> */}
        {/* </GlobalValuesProvider> */}
      </AuthProvider>
    </div>
  );
};

export default App;
