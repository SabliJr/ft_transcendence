import { useState } from "react";
import "./_after_hero.css";

const AfterHero = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    {
      id: "portfolio",
      label: "Portfolio Management",
      heading: "Track, Organize, Understand Your Holdings.",
      subheading:
        "Create and monitor crypto portfolios with clear performance insights and allocation breakdowns.",
      benefits: [
        "Create multiple portfolios with custom assets and entry prices",
        "Visualize portfolio value, returns, and performance over time",
        "Share portfolios publicly or keep them private — you're in control",
      ],
    },
    {
      id: "market",
      label: "Market & Data Analysis",
      heading: "Explore the Market with Clarity.",
      subheading:
        "Access structured crypto market data and make sense of what each asset represents.",
      benefits: [
        "Browse and filter cryptocurrencies by type, metrics, and categories",
        "View detailed asset pages with key market information",
        "Transform raw data into actionable insights with analytics dashboards",
      ],
    },
    {
      id: "social",
      label: "Social Investment Insights",
      heading: "Learn Together. Grow Together.",
      subheading:
        "Share perspectives, discuss assets, and exchange investment insights in a collaborative environment.",
      benefits: [
        "Publish investment thoughts linked to specific assets or portfolios",
        "Follow other investors and engage through comments and real-time chat",
        "Get AI-assisted explanations to understand complex market concepts",
      ],
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className='diff-container'>
      <div className='diff-content'>
        <h1 className='main-heading'>
          <span>One Platform</span>...
          <br/>
          Three Powerful Pillars
        </h1>

        {/* Tab Navigation */}
        <div className='tab-navigation'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${
                activeTab === tab.id ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className='tab-content'>
          <div className='tab-info'>
            <div className={`tab-label tab-label-${activeTab}`}>
              {activeTabData?.label}
            </div>
            <h2 className='tab-heading'>{activeTabData?.heading}</h2>
            <p className='tab-subheading'>{activeTabData?.subheading}</p>
          </div>

          <div className='tab-benefits'>
            <div className='benefits-list'>
              {activeTabData?.benefits.map((benefit, index) => (
                <div key={index} className='benefit-item'>
                  <div className='check-mark'>✓</div>
                  <div className='benefit-text'>{benefit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterHero;
