// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Public/Home";
import NotFound from "./Pages/Info/NotFound";
import Contact from "./Pages/Info/Contact";
import PrivacyPolicy from "./Pages/Legal/privacyPolicy";
import TermsOfService from "./Pages/Legal/TermsOfService";
import Signup from "./Pages/Auth/signup";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard";
import CoinDetails from "./Components/Coin/CoinDetails";
import CoinDetailsView from "./Pages/Dashboard/CoinDetailsView";
import MarketView from "./Pages/Dashboard/MarketView";
import About from "./Pages/About/index";
import Market from "./Pages/Public/Market";

// Dashboard pages:
import PortfolioView from "./Pages/Dashboard/PortfolioView";
import AIView from "./Pages/Dashboard/AIView";
import ChatView from "./Pages/Dashboard/ChatView";
import ProfileView from "./Pages/Dashboard/ProfileView";
import InsightsView from "./Pages/Dashboard/InsightsView";

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
        <Route path='/market/coin/:id' element={<CoinDetails />} />

        {/* Dashboard with nested routes */}
        <Route path='/dashboard/:userId' element={<Dashboard />}>
          <Route index element={<InsightsView />} />
          <Route path='home' element={<InsightsView />} />
          <Route path='market' element={<MarketView />} />
          <Route path='market/coin/:coinId' element={<CoinDetailsView />} />
          <Route path='portfolio' element={<PortfolioView />} />
          <Route path='ai' element={<AIView />} />
          <Route path='chat' element={<ChatView />} />
          <Route path='profile' element={<ProfileView />} />
        </Route>

        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesFile;
