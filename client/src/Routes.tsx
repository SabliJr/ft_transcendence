// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import NotFound from "./Pages/Info/NotFound";
import Contact from "./Pages/Info/Contact";
import PrivacyPolicy from "./Pages/Legal/privacyPolicy";
import TermsOfService from "./Pages/Legal/TermsOfService";
import Signup from "./Pages/Auth/signup";
import Login from "./Pages/Auth/Login";
// import SuccessPage from "./src/utils/channelConnectSuccess";
// import ProtectedRoute from "./utils/protect_routes";
import About from "./Pages/About/index";
import Market from "./Pages/Market/index";

const RoutesFile = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/market' element={<Market />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/*' element={<NotFound />} />
        {/* <Route path='/waitlist' element={<WaitList />} /> */}
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}

        {/* <Route element={<ProtectedRoute />}> */}
        {/* <Route path='/account-settings' element={<AccountSettings />} /> */}
        {/* <Route path='/dashboard/:customer_id' element={<Dashboard />} /> */}
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default RoutesFile;
