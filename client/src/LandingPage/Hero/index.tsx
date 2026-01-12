import "./Hero.css";

import PromoImg from "../../Assets/Yieldbook.jpg";

import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <section className='hero'>
      <h2>
        Smarter <span>crypto</span> portfolio management.
      </h2>
      <p className='_hero_text'>
        Track, analyze performance, manage crypto portfolios, share and exchange
        investment insights... all in one social investment workspace.
      </p>
      <div className='_hero_bton_container'>
        <button className='_hero_btn' onClick={() => navigate("/signup")}>
          Get started
        </button>
      </div>

      <img src={PromoImg} alt='promImg' className='promImg' />
      <div className='_rgb_bg'></div>
    </section>
  );
};

export default Index;
