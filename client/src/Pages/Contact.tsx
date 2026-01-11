import React from "react";
import "./Pages.css";

import { GrLinkedinOption } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

import Footer from "../Components/Footer/index";
import Header from "../Components/TheHeader/index";

const Contact = () => {
  return (
    <>
      <Header />
      <div className='_contact_help'>
        <div>
          <h3 className='_contact_title'>Contact us.</h3>
          <p className='_contact_p'>
            We are here to help you with any questions you may have. Please feel
            free to contact us.
          </p>
        </div>

        <ul className='_contact_list'>
          <li>
            <a href='mailto:info.chatfolderz@gmail.com'>
              <span>
                <MdEmail />
              </span>
              chatfolderz@gmail.com
            </a>
          </li>{" "}
          <li>
            <a
              href='https://www.linkedin.com/in/sablijr/'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <GrLinkedinOption />
              </span>
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/sablijr'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <RiTwitterXLine />
              </span>
              Twitter
            </a>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
