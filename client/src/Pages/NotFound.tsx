import React from "react";
import "./Pages.css";

import NotFoundSvg from "../utils/404_svg";
// import Logo from "../Assets/La_logo.png";
import Footer from "../Components/Footer/index";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  let navigate = useNavigate();

  return (
    <main className='_not_found_container'>
      <div className='_404_page_container'>
        {/* <img
          src={Logo}
          alt=''
          className='_la_logo'
          onClick={() => navigate("/")}
        /> */}
        <div className='_404_svg'>
          <NotFoundSvg />
        </div>
        <h2 className='_not_found_title'>Not Found!</h2>
      </div>
      <Footer />
    </main>
  );
};

export default NotFound;
