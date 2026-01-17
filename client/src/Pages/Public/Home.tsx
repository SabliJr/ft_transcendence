import Header from "../../LandingPage/TheHeader/index";
import Hero from "../../LandingPage/Hero/index";
import Features from "../../LandingPage/Features/index";
import AfterHero from "../../LandingPage/Diff/_after_hero";
import Footer from "../../LandingPage/Footer/index";
import FAQs from "../../LandingPage/FAQs/index"

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <AfterHero />
      <Features />
      <FAQs/>
      <Footer />
    </>
  );
};

export default Home;
