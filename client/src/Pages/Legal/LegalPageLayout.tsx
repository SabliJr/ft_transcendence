import React from "react";
import "./legalPages.css";

import Footer from "../../LandingPage/Footer/index";
import Header from "../../LandingPage/TheHeader/index";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  lastUpdated,
  children,
}) => {
  return (
    <main className="_legal_page_container">
      <Header />
      <div className="_legal_content_wrapper">
        <div className="_legal_title_section">
          <h1 className="_legal_title">{title}</h1>
          <p>Last updated: {lastUpdated}</p>
        </div>
        <div className="_legal_content">{children}</div>
      </div>
      <Footer />
    </main>
  );
};

export default LegalPageLayout;
