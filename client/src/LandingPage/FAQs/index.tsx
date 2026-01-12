import React, { useState } from "react";
import "./faqs.css";

import { PiPlusBold } from "react-icons/pi";
// import { useNavigate } from "react-router-dom";
// import { HiShieldCheck } from "react-icons/hi";

// import { Link as ScrollLink } from "react-scroll";

const Index = () => {
  // const navigate = useNavigate();
  const [revealQuestion, setReveal] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleQuestion = (idx: number) => {
    setReveal(revealQuestion.map((item, i) => (i === idx ? !item : false)));
  };

  return (
    <main className='_questions_container' id='faq'>
      <h2>FAQ.</h2>
      <p className='_q_title_text'>All the A's to your Q's.</p>
      <div className='_questions'>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[0] ? "_les_questions_reveal" : "_les_questions"
              }>
              Do I need design experience to use this & How is this different
              from Canva/Photoshop ?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(0)} />
          </div>
          <p
            className={
              revealQuestion[0]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Nope. We built this for creators, not designers. Unlike Canva or
            Photoshop, you don’t start with a blank page and endless tools. Our
            AI gives you ready-to-edit thumbnail concepts tailored for YouTube.
            You get professional-looking results in minutes without needing
            design skills.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[1] ? "_les_questions_reveal" : "_les_questions"
              }>
              Will these thumbnails actually improve my CTR (click-through
              rate)?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(1)} />
          </div>
          <p
            className={
              revealQuestion[1]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            While no tool can guarantee clicks, our AI is trained on thousands
            of high-performing YouTube thumbnails across different niches. That
            means every design you generate starts from proven patterns that
            viewers respond to. Instead of staring at a blank canvas, you get
            multiple strong concepts instantly, then fine-tune them with our
            editor. The result: you spend less time designing and more time
            testing thumbnails that look like the ones viewers already click on.
            Many creators see their CTR rise simply because they can create and
            test more high-quality thumbnails, faster.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[2] ? "_les_questions_reveal" : "_les_questions"
              }>
              What makes your AI different from other AI design tools?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(2)} />
          </div>
          <p
            className={
              revealQuestion[2]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Most AI design tools are generic. Our AI is specialized for YouTube
            thumbnails — trained to understand what grabs attention on the
            platform. That means layouts, colors, text placement, and styles are
            optimized for click-through rate, not just “pretty graphics.”
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[3] ? "_les_questions_reveal" : "_les_questions"
              }>
              What happens if I run out of tokens?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(3)} />
          </div>
          <p
            className={
              revealQuestion[3]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            If you run out of tokens before your next billing cycle, you can
            either upgrade your plan or top up with extra tokens instantly.
            We’ll always notify you before you hit zero so you’re never stuck
            without being able to create.
          </p>
        </div>
      </div>
      {/* <div className='_q_chat_div'>
        <h3 className='_q_chat_title'>Do you still have a question?</h3>
        <p className='_q_chat_text'>
          Send us an email on <span>info.sablijr@gmail.com</span> and we will
          get back to you on no time! Otherwise...
        </p>
        <div>
          <button
            className='_get_started_btn'
            onClick={() => navigate("/signin")}>
            Get Started
          </button>
        </div>
      </div> */}
    </main>
  );
};

export default Index;
