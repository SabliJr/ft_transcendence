import React from "react";
import "./footer.css";

import { useNavigate } from "react-router-dom";

// import { RiTwitterXLine } from "react-icons/ri";
// import { GrLinkedinOption } from "react-icons/gr";
// import { IoLogoYoutube } from "react-icons/io";

const Index = () => {
  const laDate = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className='Footer'>
      <main className='footerMain'>
        <div className='copy'>
          <h1 className='_footer_logo' onClick={() => navigate("/")}>
            Yield<span>book</span>
          </h1>
          <p>
            Yieldbook — a social crypto investment and portfolio management
            platform.
          </p>
          <p>&copy;{laDate} Yieldbook. All Rights Reserved! </p>
        </div>
        <div className='footerLinks'>
          <p
            onClick={() => navigate("/terms-of-service")}
            className='footerLinks_p'>
            Terms of Service
          </p>
          <p
            onClick={() => navigate("/privacy-policy")}
            className='footerLinks_p'>
            {" "}
            Privacy Policy
          </p>
          <p onClick={() => navigate("/contact")} className='footerLinks_p'>
            Contact
          </p>
        </div>
        {/* <div className='_links'>
          <a
            href='https://www.youtube.com/@_sabli'
            target='_blank'
            rel='noopener noreferrer'>
            <IoLogoYoutube />
          </a>
          <a
            href='https://twitter.com/sablijr'
            target='_blank'
            rel='noopener noreferrer'>
            <RiTwitterXLine />
          </a>
          <a
            href='https://www.linkedin.com/in/sablijr/'
            target='_blank'
            rel='noopener noreferrer'>
            <GrLinkedinOption />
          </a>
        </div> */}
      </main>
    </footer>
  );
};

export default Index;
