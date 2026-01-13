import Footer from "../../LandingPage/Footer/index"
import Header from '../../LandingPage/TheHeader/index'
import "./about.css"

import Team from "../../Assets/team.png"

const Index = () => {
  return (
    <main>
      <Header />
      <div className='_about_page_container'>
        <div className='_about_image_wrapper'>
          <img src={Team} alt='About Yieldbook' className='_about_hero_image' />
        </div>

        <div className='_about_content'>
          <h1 className='_about_title'>
            About Yield<span>book</span>
          </h1>

          <div className='_about_text'>
            <p>
              Yieldbook is a social crypto investment and financial management
              platform built as an academic project. Our mission is to help
              users understand their crypto portfolios, explore market data, and
              learn from a community of investors.
            </p>

            <p>
              Rather than focusing on trading or execution, Yieldbook emphasizes
              analysis, transparency, and learning. It's designed as a
              read-only, insight-driven platform where users can better
              understand their holdings and market dynamics through data
              visualization, social interaction, and AI-assisted explanations.
            </p>

            <p>
              Built with modern web technologies, Yieldbook combines portfolio
              management, market exploration, and social features into one
              collaborative workspace. Whether you're tracking your first crypto
              investment or managing multiple portfolios, Yieldbook provides the
              clarity you need to make informed decisions.
            </p>

            <p>
              This platform represents our vision of making crypto investment
              more accessible, understandable, and collaborative. Join us in
              building a community that values transparency, education, and
              shared knowledge.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Index
