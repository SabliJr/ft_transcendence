import React from "react";
import "./Features.css";

import { useNavigate } from "react-router-dom";

import PortfolioAndPortfolio from "../../Assets/PortfolioNMarket.png";
import YbPost from "../../Assets/post.png";
import YbAI from "../../Assets/Yb_AI.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className='_features_container'>
      <div className='_features_copy'>
        <div className='_features_title'>
          <h2>
            Your <span>Comprehensive Crypto</span> Investment Companion.
          </h2>
          <p>
            Yieldbook provides the tools and insights you need to confidently
            manage and grow your crypto portfolio.
          </p>
        </div>
        <button className='_features_btn' onClick={() => navigate("/signup")}>
          Get Started today
        </button>
      </div>
      <div className='_features_grid'>
        {/* Left Column */}
        <div className='_left_column'>
          {/* Box 1: Portfolio & Market Combined */}
          <div className='_func_box _func_box_top'>
            <div className='_txt_div'>
              <h4>Track portfolios. Explore markets.</h4>
              <p>
                Monitor performance, visualize allocations, and browse crypto
                assets with real-time data.
              </p>
            </div>
            <div className='_box_img'>
              <img src={PortfolioAndPortfolio} alt='Portfolio & Market' />
            </div>
          </div>

          {/* Box 2: Social Investment Insights */}
          <div className='_func_box _func_box_bottom'>
            <div className='_box_img_social'>
              <img src={YbPost} alt='Social Investment Insights' />
            </div>
            <div className='_txt_div'>
              <h4>Learn from others. Share yours.</h4>
              <p>
                Follow investors, explore portfolios, and join market
                discussions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - AI Assistant (Full Height) */}
        <div className='_right_column'>
          <div className='_func_box _func_box_ai'>
            <div className='_txt_div_ai'>
              <h4>Understand your portfolio with AI.</h4>
              <p>
                Get plain-language answers about assets, diversification, and
                strategy.
              </p>
            </div>
            <div className='_box_img_ai'>
              <img src={YbAI} alt='AI Portfolio Assistant' />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
