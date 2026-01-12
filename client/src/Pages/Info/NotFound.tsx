import "./info.css";

import NotFoundSvg from "../../utils/404_svg";
import Footer from "../../LandingPage/Footer/index";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className='_not_found_container'>
      <div className='_404_page_container'>
        <h1 className='_la_logo' onClick={() => navigate("/")}>
          Yield<span>book</span>
        </h1>
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
