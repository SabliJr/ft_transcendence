import React, { useState } from "react";
import "./faqs.css";

import { PiPlusBold } from "react-icons/pi";

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
              Is my portfolio data secure on Yieldbook?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(0)} />
          </div>
          <p
            className={
              revealQuestion[0]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Yes, we take security seriously. Your portfolio data is stored securely,
            and we use encryption to protect your account. Yieldbook is read-only and
            doesn't connect to exchange wallets, so your actual crypto assets remain safe.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[1] ? "_les_questions_reveal" : "_les_questions"
              }>
              Can I track multiple crypto portfolios?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(1)} />
          </div>
          <p
            className={
              revealQuestion[1]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Absolutely! Yieldbook allows you to create and manage multiple portfolios.
            Whether you're separating long-term holdings from trading portfolios or
            tracking different investment strategies, you can organize everything in one place.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[2] ? "_les_questions_reveal" : "_les_questions"
              }>
              How accurate is the market data?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(2)} />
          </div>
          <p
            className={
              revealQuestion[2]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            We source real-time cryptocurrency data from trusted third-party providers.
            While we strive for accuracy, market data may occasionally be delayed or contain
            minor discrepancies. Always verify critical information before making investment decisions.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4
              className={
                revealQuestion[3] ? "_les_questions_reveal" : "_les_questions"
              }>
              What does the AI assistant do?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(3)} />
          </div>
          <p
            className={
              revealQuestion[3]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Our AI assistant helps you understand your portfolio structure, explains
            crypto assets in simple terms, and provides insights on diversification.
            It's designed for educational purposes and doesn't provide financial advice.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Index;
