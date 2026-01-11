import React from "react";
import "./index.css";

import DeepSeek from "../../Assets/DeepSeek_logo.svg.png";
import GPT from "../../Assets/chatgpt-logo-with-text.png";
import Claude from "../../Assets/Claude_Ai.svg.png";
import Gemini from "../../Assets/Google_Gemini_logo.svg.png";
import Mistal from "../../Assets/mistral-ais.webp";

// import La_platform from "../../Assets/HomePage.png";

import ShortCut from "../../Assets/shortcut_mac.webp";
import TextSelection from "../../Assets/launch_via_text_selection.webp";
import IconLaunch from "../../Assets/launch_via_ext.webp";

const Index = () => {
  return (
    <>
      <section className='_diff_container' id='DiiF'>
        <div className='_diff_text_container'>
          <h1>Powered by the Most Intelligent AI Models in the World!</h1>
          <p>
            The smartest AI models, working for you — powering better writing in
            Gmail, LinkedIn, Docs, and anywhere you type.
          </p>
        </div>
        <div className='_diff_text_and_img'>
          <img src={Gemini} alt='' className='_ai_logo _gemini_ai' />
          <img src={Claude} alt='' className='_ai_logo _claude_ai' />
          <img src={DeepSeek} alt='' className='_ai_logo _deepseek_ai' />
          <img src={GPT} alt='' className='_ai_logo' />
          <img src={Mistal} alt='' className='_ai_logo _mistral_ai' />
        </div>
      </section>
      <section className='workSection'>
        <h3 className='workTitle'>Launch It Your Way.</h3>
        <p className='_features_text'>
          Open the AI assistant instantly — from the extension icon, keyboard
          shortcut, or by simply selecting text—wherever you’re working in the
          browser.
        </p>
        <button className='_middle_cta'>Start In One Click</button>
        <div className='_launch_divs'>
          <div>
            <h3>Launch from Extension Icon</h3>
            <img src={IconLaunch} alt='' className='_launch_img' />
          </div>
          <div>
            <h3>Launch via Shortcut</h3>
            <img src={ShortCut} alt='' className='_launch_img' />
          </div>
          <div>
            <h3>Launch by Selecting Text</h3>
            <img src={TextSelection} alt='' className='_launch_img' />
          </div>
        </div>
        {/* <div className='_demo_video_container'>
        <img src={La_platform} alt='' className='_platform_img' />
      </div> */}
      </section>
    </>
  );
};

export default Index;
