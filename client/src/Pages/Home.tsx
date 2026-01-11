import React from "react";
import "../App.css";

import Header from "../Components/TheHeader/index";
import Hero from "../Components/Hero/index";
import Features from "../Components/Features/index";
import AfterHero from "../Components/Diff/_after_hero";
// import Diff from "../Components/Diff/index";
// import FAQ from "../Components/FAQ/index";
import Footer from "../Components/Footer/index";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <div className='Home'>
        {/* <Diff /> */}
        <AfterHero />
        <Features />
        {/* <FAQ /> */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
